import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { Role } from "../../generated/prisma/enums";
import { RegisterDto, LoginDto, UpdatePerfilDto, CambiarRolDto } from "../dtos/usuario.dto";

const perfilPublico = {
    id: true,
    nombre: true,
    apellidos: true,
    email: true,
    role: true,
    activo: true,
    telefono: true,
    createAt: true,
};

function generarToken(usuario: { id: number; email: string; role: Role }) {
    return jwt.sign(
        { id: usuario.id, email: usuario.email, role: usuario.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
}

export const usuarioService = {
    async listar() {
        return await prisma.usuario.findMany({
            select: perfilPublico,
            orderBy: {
                id: "asc",
            },
        });
    },

    async cambiarEstado(id: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
        });

        if (!usuario) {
            throw AppError.notFound("Usuario no encontrado");
        }

        return await prisma.usuario.update({
            where: { id },
            data: {
                activo: !usuario.activo,
            },
            select: perfilPublico,
        });
    },

    async registrar(datos: RegisterDto) {
        const existente = await prisma.usuario.findUnique({
            where: { email: datos.email },
        });

        if (existente) {
            throw AppError.conflict("Ya existe un usuario registrado con ese correo");
        }

        const passwordHasheada = await bcrypt.hash(datos.password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nombre: datos.nombre,
                apellidos: datos.apellidos,
                email: datos.email,
                password: passwordHasheada,
                telefono: datos.telefono,
                role: Role.USER,
            },
            select: perfilPublico,
        });

        return usuario;
    },

    async login(datos: LoginDto) {
        const usuario = await prisma.usuario.findUnique({
            where: { email: datos.email },
        });

        if (!usuario) {
            throw AppError.unauthorized("Correo o contraseña incorrectos");
        }

        const passwordValida = await bcrypt.compare(datos.password, usuario.password);

        if (!passwordValida) {
            throw AppError.unauthorized("Correo o contraseña incorrectos");
        }

        if (!usuario.activo) {
            throw AppError.forbidden("Su cuenta se encuentra desactivada. Contacte al administrador");
        }

        const token = generarToken(usuario);

        const { password, ...usuarioSinPassword } = usuario;

        return { usuario: usuarioSinPassword, token };
    },

    async obtenerPerfil(id: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
            select: perfilPublico,
        });

        if (!usuario) {
            throw AppError.notFound("Usuario no encontrado");
        }

        return usuario;
    },

    async cambiarRol(id: number, datos: CambiarRolDto) {
        const usuario = await prisma.usuario.findUnique({ where: { id } });

        if (!usuario) {
            throw AppError.notFound("Usuario no encontrado");
        }

        return await prisma.usuario.update({
            where: { id },
            data: { role: datos.role },
            select: perfilPublico,
        });
    },

    async actualizarPerfil(id: number, datos: UpdatePerfilDto) {
        const existente = await prisma.usuario.findUnique({ where: { email: datos.email } });

        if (existente && existente.id !== id) {
            throw AppError.conflict("Ya existe un usuario registrado con ese correo");
        }

        return await prisma.usuario.update({
            where: { id },
            data: {
                nombre: datos.nombre,
                apellidos: datos.apellidos,
                email: datos.email,
                telefono: datos.telefono,
            },
            select: perfilPublico,
        });
    },
};
