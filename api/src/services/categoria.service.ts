import { prisma } from "../config/prisma";

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
      throw new Error("Categoría no encontrada");
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