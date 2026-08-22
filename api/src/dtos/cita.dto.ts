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

export const aceptarCitaSchema = z.object({
    comentarioTutor: z
        .string()
        .trim()
        .max(255, "El comentario no puede superar 255 caracteres")
        .optional()
});

export const rechazarCitaSchema = z.object({
    motivo: z
        .string()
        .trim()
        .min(5, "El motivo debe tener al menos 5 caracteres")
        .max(255, "El motivo no puede superar 255 caracteres")
});

export const cancelarCitaSchema = z.object({
    motivo: z
        .string()
        .trim()
        .min(5, "El motivo debe tener al menos 5 caracteres")
        .max(255, "El motivo no puede superar 255 caracteres")
});

export const createResenaSchema = z.object({
    puntuacion: z
        .number()
        .int()
        .min(1, "La calificación mínima es 1")
        .max(5, "La calificación máxima es 5"),
    comentario: z
        .string()
        .trim()
        .max(355, "El comentario no puede superar los 355 caracteres")
        .optional()
});

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type UpdateCitaDto = z.infer<typeof updateCitaSchema>;
export type AceptarCitaDto = z.infer<typeof aceptarCitaSchema>;
export type RechazarCitaDto = z.infer<typeof rechazarCitaSchema>;
export type CancelarCitaDto = z.infer<typeof cancelarCitaSchema>;
export type CreateResenaDto = z.infer<typeof createResenaSchema>;