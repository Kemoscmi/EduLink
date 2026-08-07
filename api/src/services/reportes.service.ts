import { prisma } from "../config/prisma";
import { EstadoCita } from "../../generated/prisma/enums";

export const reportesService = {
  async getCitasPorEstado(filtros: { tutorId?: number; categoriaId?: number; fechaInicio?: Date; fechaFin?: Date }) {
    const where: any = {};

    if (filtros.tutorId) {
      where.tutorId = filtros.tutorId;
    }

    if (filtros.categoriaId) {
      where.servicio = {
        categoriaId: filtros.categoriaId,
      };
    }

    if (filtros.fechaInicio || filtros.fechaFin) {
      where.fechaCita = {};
      if (filtros.fechaInicio) {
        where.fechaCita.gte = filtros.fechaInicio;
      }
      if (filtros.fechaFin) {
        const dateFin = new Date(filtros.fechaFin);
        dateFin.setHours(23, 59, 59, 999);
        where.fechaCita.lte = dateFin;
      }
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
        tutor: {
          select: {
            id: true,
            usuario: {
              select: {
                nombre: true,
                apellidos: true,
              },
            },
          },
        },
        servicio: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            categoria: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: {
        fechaCita: "desc",
      },
    });

    const totales = {
      PENDIENTE: 0,
      ACEPTADA: 0,
      RECHAZADA: 0,
      CANCELADA: 0,
      COMPLETADA: 0,
      totalGeneral: citas.length,
    };

    citas.forEach((cita) => {
      const estado = cita.estado as EstadoCita;
      if (totales[estado] !== undefined) {
        totales[estado]++;
      }
    });

    const porcentajes = {
      PENDIENTE: totales.totalGeneral > 0 ? Number(((totales.PENDIENTE / totales.totalGeneral) * 100).toFixed(2)) : 0,
      ACEPTADA: totales.totalGeneral > 0 ? Number(((totales.ACEPTADA / totales.totalGeneral) * 100).toFixed(2)) : 0,
      RECHAZADA: totales.totalGeneral > 0 ? Number(((totales.RECHAZADA / totales.totalGeneral) * 100).toFixed(2)) : 0,
      CANCELADA: totales.totalGeneral > 0 ? Number(((totales.CANCELADA / totales.totalGeneral) * 100).toFixed(2)) : 0,
      COMPLETADA: totales.totalGeneral > 0 ? Number(((totales.COMPLETADA / totales.totalGeneral) * 100).toFixed(2)) : 0,
    };

    return {
      totales,
      porcentajes,
      citas,
    };
  },

  async getCitasPorProfesional(tutorId?: number) {
    const where: any = {};
    if (tutorId) {
      where.id = tutorId;
    }

    const tutores = await prisma.perfilTutor.findMany({
      where,
      include: {
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
          },
        },
        citas: {
          select: {
            id: true,
            estado: true,
          },
        },
      },
    });

    const report = tutores.map((tutor) => {
      const totalCitas = tutor.citas.length;
      const completadas = tutor.citas.filter((c) => c.estado === EstadoCita.COMPLETADA).length;
      const porcentajeFinalizacion = totalCitas > 0 ? Number(((completadas / totalCitas) * 100).toFixed(2)) : 0;

      return {
        tutorId: tutor.id,
        nombre: `${tutor.usuario.nombre} ${tutor.usuario.apellidos}`,
        totalCitas,
        completadas,
        porcentajeFinalizacion,
      };
    });

    return report;
  },

  async getCalificacionesReport(tutorId?: number) {
    const where: any = {};
    if (tutorId) {
      where.id = tutorId;
    }

    const tutores = await prisma.perfilTutor.findMany({
      where,
      include: {
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
          },
        },
        resenas: {
          include: {
            cita: {
              include: {
                servicio: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            },
          },
        },
        servicios: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return tutores.map((tutor) => {
      const resenas = tutor.resenas;
      const cantidadResenas = resenas.length;
      const promedioCalificacion =
        cantidadResenas > 0
          ? Number((resenas.reduce((sum, r) => sum + r.puntuacion, 0) / cantidadResenas).toFixed(2))
          : 0;

      // Reseñas grupales por servicio
      const serviceRatings: { [serviceId: number]: { nombre: string; sum: number; count: number } } = {};
      tutor.servicios.forEach((s) => {
        serviceRatings[s.id] = { nombre: s.nombre, sum: 0, count: 0 };
      });

      resenas.forEach((r) => {
        const sId = r.cita.servicioId;
        const sName = r.cita.servicio.nombre;
        if (!serviceRatings[sId]) {
          serviceRatings[sId] = { nombre: sName, sum: 0, count: 0 };
        }
        serviceRatings[sId].sum += r.puntuacion;
        serviceRatings[sId].count++;
      });

      const servicesList = Object.keys(serviceRatings).map((idStr) => {
        const id = Number(idStr);
        const s = serviceRatings[id];
        return {
          id,
          nombre: s.nombre,
          promedio: s.count > 0 ? Number((s.sum / s.count).toFixed(2)) : null,
          cantidadResenas: s.count,
        };
      });

      const ratedServices = servicesList.filter((s) => s.promedio !== null) as Array<{
        id: number;
        nombre: string;
        promedio: number;
        cantidadResenas: number;
      }>;

      let mejorServicio = "Sin reseñas";
      if (ratedServices.length > 0) {
        //Calificación promedio descendente, luego recuento de reseñas descendente, luego alfabético
        ratedServices.sort((a, b) => {
          if (b.promedio !== a.promedio) {
            return b.promedio - a.promedio;
          }
          if (b.cantidadResenas !== a.cantidadResenas) {
            return b.cantidadResenas - a.cantidadResenas;
          }
          return a.nombre.localeCompare(b.nombre);
        });
        mejorServicio = `${ratedServices[0].nombre} (${ratedServices[0].promedio} ★)`;
      }

      // Servicios con baja calificación (< 3,0)
      const threshold = 3.0;
      const serviciosBajaCalificacion = ratedServices
        .filter((s) => s.promedio < threshold)
        .map((s) => ({
          nombre: s.nombre,
          promedio: s.promedio,
          cantidadResenas: s.cantidadResenas,
        }));

      return {
        tutorId: tutor.id,
        nombre: `${tutor.usuario.nombre} ${tutor.usuario.apellidos}`,
        promedioCalificacion,
        cantidadResenas,
        mejorServicio,
        serviciosBajaCalificacion,
      };
    });
  },
};
