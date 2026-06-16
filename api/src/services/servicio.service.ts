import { prisma } from "../config/prisma";

export const servicioService = {
  async listar() {
    return await prisma.servicio.findMany({
      orderBy: {
        id: "asc",
      },
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.servicio.findUnique({
      where: { id },
    });
  },

  async crear(data: any) {
    return await prisma.servicio.create({
      data: {
        tutorId: Number(data.tutorId),
        categoriaId: Number(data.categoriaId),
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        duracion: Number(data.duracion),
        modalidad: data.modalidad,
        activo: data.activo ?? true,
      },
    });
  },

  async editar(id: number, data: any) {
    return await prisma.servicio.update({
      where: { id },
      data: {
        tutorId: Number(data.tutorId),
        categoriaId: Number(data.categoriaId),
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        duracion: Number(data.duracion),
        modalidad: data.modalidad,
        activo: data.activo,
      },
    });
  },

  async cambiarEstado(id: number) {
    const servicio = await prisma.servicio.findUnique({
      where: { id },
    });

    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    return await prisma.servicio.update({
      where: { id },
      data: {
        activo: !servicio.activo,
      },
    });
  },
};