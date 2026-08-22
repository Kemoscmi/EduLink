import { EstadoCita, Modalidad, Role } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateProfesionalDto, UpdateProfesionalDto } from "../dtos/profesional.dto";

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
                     descripcion: true,
                     modalidad: true,
                     tarifaBase: true,
                     disponible: true,
                     imagenPerfil: true,
 
                     usuario: {
                         select: {
                             nombre: true,
                             apellidos: true
                         }
                     },
                     resenas: {
                         select: {
                             puntuacion: true
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

         const resultData = data.map(p => {
             const sum = p.resenas.reduce((acc, r) => acc + r.puntuacion, 0);
             const count = p.resenas.length;
             const promedio = count > 0 ? Number((sum / count).toFixed(2)) : 0;
             return {
                 id: p.id,
                 tituloProfesional: p.tituloProfesional,
                 descripcion: p.descripcion,
                 modalidad: p.modalidad,
                 tarifaBase: p.tarifaBase,
                 disponible: p.disponible,
                 imagenPerfil: p.imagenPerfil,
                 usuario: p.usuario,
                 promedioCalificacion: promedio,
                 cantidadResenas: count
             };
         });
 
         return {
             meta: {
                 totalItems,
                 totalPages,
                 currentPage: paginar ? page : 1,
                 limit: paginar ? limit : totalItems
             },
             data: resultData
         };
     },
     async obtenerPorId(id: number) {
 
         const tutor = await prisma.perfilTutor.findUnique({
             where: { id },
 
             include: {
                 usuario: true,
 
                 servicios: true,

                 resenas: {
                     include: {
                         cliente: {
                             select: {
                                 nombre: true,
                                 apellidos: true
                             }
                         }
                     },
                     orderBy: {
                         createAt: 'desc'
                     }
                 },
 
                 tutorEspecialidads: {
                     include: {
                         especialidad: true
                     }
                 }
             }
         });

         if (!tutor) return null;

         const sum = tutor.resenas.reduce((acc, r) => acc + r.puntuacion, 0);
         const count = tutor.resenas.length;
         const promedio = count > 0 ? Number((sum / count).toFixed(2)) : 0;

         return {
             ...tutor,
             promedioCalificacion: promedio,
             cantidadResenas: count
         };
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
    },
    async actualizar(
        id: number,
        data: UpdateProfesionalDto
    ) {

        const profesional = await prisma.perfilTutor.findUnique({
            where: { id }
        });

        if (!profesional) {
            throw new Error("Profesional no encontrado");
        }

        await prisma.usuario.update({
            where: {
                id: profesional.usuarioId
            },
            data: {
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono
            }
        });

        return prisma.perfilTutor.update({
            where: { id },
            data: {
                tituloProfesional: data.tituloProfesional,
                descripcion: data.descripcion,
                aniosExperiencia: data.aniosExperiencia,
                modalidad: data.modalidad,
                ubicacion: data.ubicacion,
                tarifaBase: data.tarifaBase,
                disponible: data.disponible,
                imagenPerfil: data.imagenPerfil
            },
            include: {
                usuario: true
            }
        });
    },
    async cambiarDisponibilidad(
        id: number
    ) {

        const profesional =
            await prisma.perfilTutor.findUnique({
                where: { id }
            });

        if (!profesional) {
            throw new Error("Profesional no encontrado");
        }

        return prisma.perfilTutor.update({
            where: { id },
            data: {
                disponible: !profesional.disponible
            }
        });
    }
}