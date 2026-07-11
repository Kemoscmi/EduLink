import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const categoriaService = {
  async listar() {
    return await prisma.categoria.findMany({
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
    const categoria = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw AppError.notFound("Categoría no encontrada");
    }

    return await prisma.categoria.update({
      where: { id },
      data: {
        activo: !categoria.activo,
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