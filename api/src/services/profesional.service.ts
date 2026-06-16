import { EstadoCita, Modalidad, Role } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateProfesionalDto } from "../dtos/profesional.dto";

export const profesionalService = {
    //LISTADO DE PROFESIONALES Mostrar: Nombre completo, Título profesional, Modalidad, Tarifa base, Disponibilidad. 
    async listar(
        page: number = 1,
        limit: number = 0,
        nombre?: string,
        modalidad?: Modalidad,
        disponible?: boolean
    ) {

        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;

        const where: any = {};

        //Búsqueda por nombre
        if (nombre) {
            where.usuario = {
                OR: [
                    {
                        nombre: {
                            contains: nombre
                        }
                    },
                    {
                        apellidos: {
                            contains: nombre
                        }
                    }
                ]
            };
        }
        //Filtro por modalidad
        if (modalidad) {
            where.modalidad = modalidad;
        }
        //Filtro por disponibilidad.  
        if (disponible !== undefined) {
            where.disponible = disponible;
        }

        const [totalItems, data] = await Promise.all([
            prisma.perfilTutor.count({ where }),

            prisma.perfilTutor.findMany({
                where,
                skip,
                take,

                select: {
                    id: true,

                    tituloProfesional: true,
                    modalidad: true,
                    tarifaBase: true,
                    disponible: true,

                    usuario: {
                        select: {
                            nombre: true,
                            apellidos: true
                        }
                    }
                },

                orderBy: {
                    usuarioId: "asc"
                }
            })
        ]);

        const totalPages = paginar
            ? Math.ceil(totalItems / limit)
            : 1;

        return {
            meta: {
                totalItems,
                totalPages,
                currentPage: paginar ? page : 1,
                limit: paginar ? limit : totalItems
            },
            data
        };
    },
    async obtenerPorId(id: number) {

        return prisma.perfilTutor.findUnique({
            where: { id },

            include: {
                usuario: true,

                servicios: true,

                tutorEspecialidads: {
                    include: {
                        especialidad: true
                    }
                }
            }
        });

    },
    async crear(data: CreateProfesionalDto) {

        await this.validateEmail(data.email);

        return prisma.perfilTutor.create({
            data: {

                usuario: {
                    create: {
                        nombre: data.nombre,
                        apellidos: data.apellidos,
                        email: data.email,

                        // temporal
                        password: "hash_password",
                        telefono: data.telefono,
                        role: Role.TUTOR
                    }
                },

                tituloProfesional: data.tituloProfesional,

                descripcion: data.descripcion,

                aniosExperiencia: data.aniosExperiencia,

                modalidad: data.modalidad,

                ubicacion: data.ubicacion,

                tarifaBase: data.tarifaBase,

                disponible: data.disponible,

                imagenPerfil:
                    data.imagenPerfil ??
                    "image-not-found.jpg"
            },

            include: {
                usuario: true
            }
        });
    },
    async validateEmail(email: string) {

        const usuario =
            await prisma.usuario.findUnique({
                where: { email }
            });

        if (usuario) {
            throw new Error(
                "Ya existe un usuario con ese correo"
            );
        }
    }
}