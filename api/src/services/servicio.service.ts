import { Role } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateServicioDto, UpdateServicioDto } from "../dtos/servicio.dto";

const includeRelations = {
  categoria: true,
  tutor: {
    include: {
      usuario: true,
    },
  },
  servicioEspecialidades: {
    include: {
      especialidad: true,
    },
  },
};

export const servicioService = {
  async listar(usuarioId?: number, role?: Role) {
    const where: any = {};
    if (role === Role.TUTOR && usuarioId) {
      where.tutor = { usuarioId };
    }

    return await prisma.servicio.findMany({
      where,
      include: includeRelations,
      orderBy: {
        id: "asc",
      },
    });
  },

  async obtenerPorId(id: number, tutorIdForzado?: number) {
    const servicio = await prisma.servicio.findUnique({
      where: { id },
      include: includeRelations,
    });

    if (servicio && tutorIdForzado !== undefined && servicio.tutorId !== tutorIdForzado) {
      throw AppError.forbidden("No tiene permiso para acceder a este servicio");
    }

    return servicio;
  },

  async validateTutor(tutorId: number) {
    const tutor = await prisma.perfilTutor.findUnique({ where: { id: tutorId } });

    if (!tutor) {
      throw AppError.badRequest("El profesional indicado no existe");
    }
  },

  async validateCategoria(categoriaId: number) {
    const categoria = await prisma.categoria.findUnique({ where: { id: categoriaId } });

    if (!categoria) {
      throw AppError.badRequest("La categoría indicada no existe");
    }
  },

  async validateEspecialidades(especialidadIds: number[]) {
    const count = await prisma.especialidad.count({
      where: { id: { in: especialidadIds } },
    });

    if (count !== especialidadIds.length) {
      throw AppError.badRequest("Una o más especialidades no existen");
    }
  },

  async validateNombreUnico(nombre: string, excludeId?: number) {
    const existente = await prisma.servicio.findUnique({ where: { nombre } });

    if (existente && existente.id !== excludeId) {
      throw AppError.conflict(`Ya existe un servicio con el nombre "${nombre}"`);
    }
  },

  async crear(data: CreateServicioDto, tutorIdForzado?: number) {
    const tutorId = tutorIdForzado ?? data.tutorId;
    await this.validateTutor(tutorId);
    await this.validateCategoria(data.categoriaId);
    await this.validateNombreUnico(data.nombre);

    if (data.especialidadesIds?.length) {
      await this.validateEspecialidades(data.especialidadesIds);
    }

    return prisma.servicio.create({
      data: {
        tutorId: tutorId,
        categoriaId: data.categoriaId,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        duracion: data.duracion,
        modalidad: data.modalidad,
        activo: data.activo ?? true,
        servicioEspecialidades: data.especialidadesIds
          ? {
              create: data.especialidadesIds.map((especialidadId) => ({ especialidadId })),
            }
          : undefined,
      },
      include: includeRelations,
    });
  },

  async editar(id: number, data: UpdateServicioDto, tutorIdForzado?: number) {
    const servicio = await prisma.servicio.findUnique({ where: { id } });

    if (!servicio) {
      throw AppError.notFound("Servicio no encontrado");
    }

    if (tutorIdForzado !== undefined && servicio.tutorId !== tutorIdForzado) {
      throw AppError.forbidden("No tiene permiso para editar este servicio");
    }

    if (data.tutorId !== undefined) {
      await this.validateTutor(data.tutorId);
    }

    if (data.categoriaId !== undefined) {
      await this.validateCategoria(data.categoriaId);
    }

    if (data.nombre !== undefined) {
      await this.validateNombreUnico(data.nombre, id);
    }

    if (data.especialidadesIds?.length) {
      await this.validateEspecialidades(data.especialidadesIds);
    }

    return prisma.servicio.update({
      where: { id },
      data: {
        tutorId: data.tutorId,
        categoriaId: data.categoriaId,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        duracion: data.duracion,
        modalidad: data.modalidad,
        activo: data.activo,
        servicioEspecialidades: data.especialidadesIds
          ? {
              deleteMany: {},
              create: data.especialidadesIds.map((especialidadId) => ({ especialidadId })),
            }
          : undefined,
      },
      include: includeRelations,
    });
  },

  async cambiarEstado(id: number, tutorIdForzado?: number) {
    const servicio = await prisma.servicio.findUnique({ where: { id } });

    if (!servicio) {
      throw AppError.notFound("Servicio no encontrado");
    }

    if (tutorIdForzado !== undefined && servicio.tutorId !== tutorIdForzado) {
      throw AppError.forbidden("No tiene permiso para cambiar el estado de este servicio");
    }

    return prisma.servicio.update({
      where: { id },
      data: {
        activo: !servicio.activo,
      },
      include: includeRelations,
    });
  },
};
