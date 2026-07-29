import { EstadoCita, Role } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateCitaDto } from "../dtos/cita.dto";
import { AppError } from "../utils/app-error";

interface Actor {
    id: number;
    role: Role;
}

const citaResumenSelect = {
    id: true,
    tutorId: true,
    fechaCita: true,
    horaInicio: true,
    horaFin: true,
    modalidad: true,
    estado: true,
    montoEstimado: true,

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
} as const;

export const citaService = {
    // Citas del usuario autenticado: cliente ve las suyas, profesional ve las suyas.
    // Un administrador no tiene citas propias, por lo que recibe una lista vacía.
    async misCitas(usuarioId: number, role: Role) {
        if (role === Role.ADMIN) {
            return [];
        }

        const where = role === Role.TUTOR
            ? { tutor: { usuarioId } }
            : { clienteId: usuarioId };

        return await prisma.cita.findMany({
            where,
            select: citaResumenSelect,
            orderBy: {
                fechaCita: "desc"
            }
        });
    },

    //El listado deberá mostrar como mínimo: Cliente, Profesional, Servicio, Fecha, Hora, Estado. 
    async listar(
        //Recibe los filtros y parámetros de paginación
        page: number = 1,
        limit: number = 0,
        estado?: EstadoCita,
        tutorId?: number,
        fechaInicio?: Date,
        fechaFin?: Date
    ) {
        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;

        //Objeto de filtros
        const where: any = {};

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
    async obtenerPorId(id: number) {
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
    async crear(data: CreateCitaDto) {

        await this.validateCliente(data.clienteId);

        const tutor = await this.validateTutor(data.tutorId);

        const servicio = await this.validateServicio(data.servicioId);

        if (!servicio.activo) {
            throw AppError.badRequest("El servicio seleccionado no está activo");
        }

        if (!tutor.disponible) {
            throw AppError.badRequest("El profesional seleccionado no está disponible");
        }

        const inicioSolicitado = this.combinarFechaHora(data.fechaCita, data.horaInicio);

        if (inicioSolicitado.getTime() <= Date.now()) {
            throw AppError.badRequest("La fecha y hora de la cita deben ser futuras");
        }

        // La hora de finalización siempre se calcula a partir de la duración real del
        // servicio; no se confía en el valor que envíe el cliente.
        const horaFinCalculada = this.calcularHoraFin(data.horaInicio, servicio.duracion);

        await this.validarSinTraslape(data.tutorId, data.fechaCita, data.horaInicio, horaFinCalculada);

        return prisma.cita.create({
            data: {
                clienteId: data.clienteId,
                tutorId: data.tutorId,
                servicioId: data.servicioId,

                fechaCita: data.fechaCita,
                horaInicio: data.horaInicio,
                horaFin: horaFinCalculada,

                modalidad: data.modalidad,

                comentarioCliente: data.comentarioCliente,

                // El monto histórico se fija al precio vigente del servicio al momento
                // de la solicitud; cambios posteriores al precio no lo alteran.
                montoEstimado: servicio.precio,

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

    calcularHoraFin(horaInicio: string, duracionMinutos: number): string {
        const [horas, minutos] = horaInicio.split(":").map(Number);
        const totalMinutos = horas * 60 + minutos + duracionMinutos;
        const horaFin = Math.floor(totalMinutos / 60) % 24;
        const minutoFin = totalMinutos % 60;
        return `${String(horaFin).padStart(2, "0")}:${String(minutoFin).padStart(2, "0")}`;
    },

    minutosDesdeMedianoche(hora: string): number {
        const [horas, minutos] = hora.split(":").map(Number);
        return horas * 60 + minutos;
    },

    // Evita que un mismo profesional quede con dos citas (Pendiente o Aceptada)
    // en horarios que se solapan el mismo día.
    async validarSinTraslape(tutorId: number, fechaCita: Date, horaInicio: string, horaFin: string) {
        const inicioNuevo = this.minutosDesdeMedianoche(horaInicio);
        const finNuevo = this.minutosDesdeMedianoche(horaFin);

        // Se usan los componentes UTC de fechaCita (no horas locales) para que el
        // límite del día coincida siempre con el mismo instante sin importar la
        // zona horaria del servidor.
        const inicioDia = new Date(Date.UTC(
            fechaCita.getUTCFullYear(),
            fechaCita.getUTCMonth(),
            fechaCita.getUTCDate()
        ));
        const finDia = new Date(Date.UTC(
            fechaCita.getUTCFullYear(),
            fechaCita.getUTCMonth(),
            fechaCita.getUTCDate() + 1
        ));

        const citasDelDia = await prisma.cita.findMany({
            where: {
                tutorId,
                fechaCita: { gte: inicioDia, lt: finDia },
                estado: { in: [EstadoCita.PENDIENTE, EstadoCita.ACEPTADA] }
            },
            select: { horaInicio: true, horaFin: true }
        });

        const haySolape = citasDelDia.some((cita) => {
            const inicioExistente = this.minutosDesdeMedianoche(cita.horaInicio);
            const finExistente = this.minutosDesdeMedianoche(cita.horaFin);
            return inicioExistente < finNuevo && finExistente > inicioNuevo;
        });

        if (haySolape) {
            throw AppError.conflict("El profesional ya tiene otra cita en ese horario");
        }
    },

    // Pendiente -> Aceptada. Solo el profesional asignado (o un administrador).
    async aceptar(id: number, actor: Actor, comentarioTutor?: string) {
        const cita = await this.obtenerCitaOFallar(id);

        if (cita.estado !== EstadoCita.PENDIENTE) {
            throw AppError.conflict("Solo se pueden aceptar citas en estado Pendiente");
        }

        await this.verificarTutorPropietario(cita.tutorId, actor);

        const actualizada = await prisma.cita.update({
            where: { id },
            data: {
                estado: EstadoCita.ACEPTADA,
                comentarioTutor: comentarioTutor ?? cita.comentarioTutor
            },
            select: citaResumenSelect
        });

        await this.registrarHistorial(id, cita.estado, EstadoCita.ACEPTADA, comentarioTutor ?? "Aceptada por el profesional.");

        return actualizada;
    },

    // Pendiente -> Rechazada. Solo el profesional asignado (o un administrador). Motivo obligatorio.
    async rechazar(id: number, actor: Actor, motivo: string) {
        const cita = await this.obtenerCitaOFallar(id);

        if (cita.estado !== EstadoCita.PENDIENTE) {
            throw AppError.conflict("Solo se pueden rechazar citas en estado Pendiente");
        }

        await this.verificarTutorPropietario(cita.tutorId, actor);

        const actualizada = await prisma.cita.update({
            where: { id },
            data: {
                estado: EstadoCita.RECHAZADA,
                comentarioTutor: motivo
            },
            select: citaResumenSelect
        });

        await this.registrarHistorial(id, cita.estado, EstadoCita.RECHAZADA, motivo);

        return actualizada;
    },

    // Pendiente o Aceptada -> Cancelada. Cliente o profesional dueños de la cita (o un administrador). Motivo obligatorio.
    async cancelar(id: number, actor: Actor, motivo: string) {
        const cita = await this.obtenerCitaOFallar(id);

        if (cita.estado !== EstadoCita.PENDIENTE && cita.estado !== EstadoCita.ACEPTADA) {
            throw AppError.conflict("Solo se pueden cancelar citas en estado Pendiente o Aceptada");
        }

        await this.verificarClienteOTutorPropietario(cita, actor);

        const actualizada = await prisma.cita.update({
            where: { id },
            data: {
                estado: EstadoCita.CANCELADA
            },
            select: citaResumenSelect
        });

        await this.registrarHistorial(id, cita.estado, EstadoCita.CANCELADA, motivo);

        return actualizada;
    },

    // Aceptada -> Completada. Solo el profesional asignado (o un administrador), y solo después de la fecha/hora programadas.
    async completar(id: number, actor: Actor) {
        const cita = await this.obtenerCitaOFallar(id);

        if (cita.estado !== EstadoCita.ACEPTADA) {
            throw AppError.conflict("Solo se pueden completar citas en estado Aceptada");
        }

        await this.verificarTutorPropietario(cita.tutorId, actor);

        const finCita = this.combinarFechaHora(cita.fechaCita, cita.horaFin);

        if (finCita.getTime() > Date.now()) {
            throw AppError.badRequest("No se puede completar una cita antes de su fecha y hora programadas");
        }

        const actualizada = await prisma.cita.update({
            where: { id },
            data: {
                estado: EstadoCita.COMPLETADA
            },
            select: citaResumenSelect
        });

        await this.registrarHistorial(id, cita.estado, EstadoCita.COMPLETADA, "Sesión realizada.");

        return actualizada;
    },

    async historial(id: number) {
        await this.obtenerCitaOFallar(id);

        return await prisma.historialCita.findMany({
            where: { citaId: id },
            orderBy: { fecha: "asc" }
        });
    },

    async obtenerCitaOFallar(id: number) {
        const cita = await prisma.cita.findUnique({ where: { id } });

        if (!cita) {
            throw AppError.notFound("Cita no encontrada");
        }

        return cita;
    },

    async verificarTutorPropietario(tutorId: number, actor: Actor) {
        if (actor.role === Role.ADMIN) {
            return;
        }

        if (actor.role !== Role.TUTOR) {
            throw AppError.forbidden("Solo el profesional asignado a esta cita puede realizar esta acción");
        }

        const perfil = await prisma.perfilTutor.findUnique({ where: { id: tutorId } });

        if (!perfil || perfil.usuarioId !== actor.id) {
            throw AppError.forbidden("Solo el profesional asignado a esta cita puede realizar esta acción");
        }
    },

    async verificarClienteOTutorPropietario(cita: { clienteId: number; tutorId: number }, actor: Actor) {
        if (actor.role === Role.ADMIN) {
            return;
        }

        if (actor.role === Role.USER && cita.clienteId === actor.id) {
            return;
        }

        if (actor.role === Role.TUTOR) {
            const perfil = await prisma.perfilTutor.findUnique({ where: { id: cita.tutorId } });

            if (perfil && perfil.usuarioId === actor.id) {
                return;
            }
        }

        throw AppError.forbidden("No tiene permiso para cancelar esta cita");
    },

    async registrarHistorial(citaId: number, estadoAnterior: EstadoCita, estadoNuevo: EstadoCita, motivo?: string) {
        await prisma.historialCita.create({
            data: { citaId, estadoAnterior, estadoNuevo, motivo }
        });
    },

    // Usa los componentes UTC de fecha (no horas locales) para evitar que el
    // resultado caiga en un día distinto según la zona horaria del servidor.
    combinarFechaHora(fecha: Date, hora: string): Date {
        const [horas, minutos] = hora.split(":").map(Number);
        return new Date(Date.UTC(
            fecha.getUTCFullYear(),
            fecha.getUTCMonth(),
            fecha.getUTCDate(),
            horas || 0,
            minutos || 0,
            0,
            0
        ));
    },

    async validateCliente(clienteId: number) {
        const cliente = await prisma.usuario.findUnique({
            where: { id: clienteId }
        });

        if (!cliente) {
            throw AppError.notFound("El cliente no existe");
        }

        return cliente;
    },

    async validateTutor(tutorId: number) {
        const tutor = await prisma.perfilTutor.findUnique({
            where: { id: tutorId }
        });

        if (!tutor) {
            throw AppError.notFound("El profesional no existe");
        }

        return tutor;
    },
    async validateServicio(servicioId: number) {
        const servicio = await prisma.servicio.findUnique({
            where: { id: servicioId }
        });

        if (!servicio) {
            throw AppError.notFound("El servicio no existe");
        }

        return servicio;
    }


}