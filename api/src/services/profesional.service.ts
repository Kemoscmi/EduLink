import { EstadoCita, Modalidad } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";

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

    }
}