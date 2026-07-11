import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const especialidadService = {
  async listar() {
    return await prisma.especialidad.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        activo: true,
        createAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  },

  async cambiarEstado(id: number) {
    const especialidad = await prisma.especialidad.findUnique({
      where: { id },
    });

    if (!especialidad) {
      throw AppError.notFound("Especialidad no encontrada");
    }

    return await prisma.especialidad.update({
      where: { id },
      data: {
        activo: !especialidad.activo,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        activo: true,
      },
    });
  },
};
