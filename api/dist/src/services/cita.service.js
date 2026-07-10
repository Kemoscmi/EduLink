import { EstadoCita } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
export const citaService = {
    //El listado deberá mostrar como mínimo: Cliente, Profesional, Servicio, Fecha, Hora, Estado. 
    async listar(
    //Recibe los filtros y parámetros de paginación
    page = 1, limit = 0, estado, tutorId, fechaInicio, fechaFin) {
        const paginar = limit > 0;
        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;
        //Objeto de filtros
        const where = {};
        //Filtrar por estado
        if (estado) {
            where.estado = estado;
        }
        //Filtrar por tutor 
        if (tutorId) {
            where.tutorId = tutorId;
        }
        //Filtrar por rango de fechas
        if (fechaInicio || fechaFin) {
            where.fechaCita = {};
            //se utiliza gte como Mayor o igual que
            if (fechaInicio) {
                where.fechaCita.gte = fechaInicio;
            }
            //y se utiliza lte como Menor o igual que
            if (fechaFin) {
                where.fechaCita.lte = fechaFin;
            }
        }
        const [totalItems, data] = await Promise.all([
            prisma.cita.count({ where }),
            prisma.cita.findMany({
                where,
                skip,
                take,
                select: {
                    id: true,
                    tutorId: true,
                    fechaCita: true,
                    horaInicio: true,
                    horaFin: true,
                    estado: true,
                    cliente: {
                        select: {
                            nombre: true,
                            apellidos: true
                        }
                    },
                    tutor: {
                        select: {
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellidos: true
                                }
                            }
                        }
                    },
                    servicio: {
                        select: {
                            nombre: true
                        }
                    }
                },
                orderBy: {
                    fechaCita: "desc"
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
    //Vista Detalle: Como mínimo: Cliente, Profesional, Servicio, Fecha, Hora, Modalidad, Descripción, Estado 
    async obtenerPorId(id) {
        return await prisma.cita.findUnique({
            where: { id },
            select: {
                id: true,
                fechaCita: true,
                horaInicio: true,
                horaFin: true,
                modalidad: true,
                estado: true,
                comentarioCliente: true,
                comentarioTutor: true,
                montoEstimado: true,
                cliente: {
                    select: {
                        nombre: true,
                        apellidos: true,
                        email: true,
                        telefono: true
                    }
                },
                tutor: {
                    select: {
                        tituloProfesional: true,
                        modalidad: true,
                        usuario: {
                            select: {
                                nombre: true,
                                apellidos: true,
                                email: true,
                                telefono: true
                            }
                        }
                    }
                },
                servicio: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true
                    }
                }
            }
        });
    },
    async crear(data) {
        await this.validateCliente(data.clienteId);
        await this.validateTutor(data.tutorId);
        await this.validateServicio(data.servicioId);
        return prisma.cita.create({
            data: {
                clienteId: data.clienteId,
                tutorId: data.tutorId,
                servicioId: data.servicioId,
                fechaCita: data.fechaCita,
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                modalidad: data.modalidad,
                comentarioCliente: data.comentarioCliente,
                // Regla del negocio
                estado: EstadoCita.PENDIENTE
            },
            include: {
                cliente: true,
                tutor: {
                    include: {
                        usuario: true
                    }
                },
                servicio: true
            }
        });
    },
    async validateCliente(clienteId) {
        const cliente = await prisma.usuario.findUnique({
            where: { id: clienteId }
        });
        if (!cliente) {
            throw new Error("El cliente no existe");
        }
    },
    async validateTutor(tutorId) {
        const tutor = await prisma.perfilTutor.findUnique({
            where: { id: tutorId }
        });
        if (!tutor) {
            throw new Error("El profesional no existe");
        }
    },
    async validateServicio(servicioId) {
        const servicio = await prisma.servicio.findUnique({
            where: { id: servicioId }
        });
        if (!servicio) {
            throw new Error("El servicio no existe");
        }
    }
};
