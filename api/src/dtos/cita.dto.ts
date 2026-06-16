import { z } from "zod";
import { Modalidad } from "../../generated/prisma/enums";

export const createCitaSchema = z.object({

    clienteId: z
        .number()
        .int()
        .positive("El cliente es obligatorio"),

    tutorId: z
        .number()
        .int()
        .positive("El profesional es obligatorio"),

    servicioId: z
        .number()
        .int()
        .positive("El servicio es obligatorio"),

    fechaCita: z.coerce.date({
        message: "La fecha es obligatoria"
    }),

    horaInicio: z
        .string()
        .trim()
        .min(1, "La hora de inicio es obligatoria")
        .max(50),

    horaFin: z
        .string()
        .trim()
        .min(1, "La hora de finalización es obligatoria")
        .max(50),

    modalidad: z.nativeEnum(Modalidad, {
        message: "La modalidad es obligatoria"
    }),

    comentarioCliente: z
        .string()
        .trim()
        .min(5, "La descripción debe tener al menos 5 caracteres")
        .max(200, "La descripción no puede superar 200 caracteres")

});

export const updateCitaSchema = createCitaSchema.partial();

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type UpdateCitaDto = z.infer<typeof updateCitaSchema>;