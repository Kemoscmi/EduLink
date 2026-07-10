import { prisma } from "../config/prisma";
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
    async cambiarEstado(id) {
        const especialidad = await prisma.especialidad.findUnique({
            where: { id },
        });
        if (!especialidad) {
            throw new Error("Especialidad no encontrada");
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
