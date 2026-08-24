import { z } from "zod";
import { Modalidad } from "../../generated/prisma/enums";

export const createProfesionalSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(1,  "El nombre es obligatorio")
        .max(120),

    apellidos: z
        .string()
        .trim()
        .min(1)
        .max(170),

    email: z
        .email(),

    telefono: z
        .string()
        .trim()
        .min(8)
        .max(20),

    tituloProfesional: z
        .string()
        .trim()
        .min(1, "El título profesional es obligatorio")
        .max(300),

    descripcion: z
        .string()
        .trim()
        .max(255)
        .optional(),

    aniosExperiencia: z.
        number()
        .int()
        .min(0, "La experiencia debe ser válida"),

    modalidad: z.nativeEnum(Modalidad),

    ubicacion: z
        .string()
        .trim()
        .min(1)
        .max(255),

    tarifaBase: z
        .number()
        .gt(0, "La tarifa debe ser mayor que cero"),

    disponible: z
        .boolean(),

    imagenPerfil: z
        .string()
        .optional(),

    especialidadesIds: z
        .array(z.number())
        .optional()

});
export const updateProfesionalSchema = createProfesionalSchema.partial();


export type CreateProfesionalDto = z.infer<typeof createProfesionalSchema>;
export type UpdateProfesionalDto = z.infer<typeof updateProfesionalSchema>;