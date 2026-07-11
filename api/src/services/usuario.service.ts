import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const usuarioService = {
  async listar() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        role: true,
        activo: true,
        telefono: true,
        createAt: true,
      },
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
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        role: true,
        activo: true,
      },
    });
  },
};