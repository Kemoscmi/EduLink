import { z } from "zod";
import { Role } from "../../generated/prisma/enums";

export const registerSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(120, "El nombre no puede superar 120 caracteres"),

    apellidos: z
        .string()
        .trim()
        .min(2, "Los apellidos deben tener al menos 2 caracteres")
        .max(170, "Los apellidos no pueden superar 170 caracteres"),

    email: z
        .email("El correo electrónico no es válido")
        .trim()
        .toLowerCase()
        .max(150, "El correo no puede superar 150 caracteres"),

    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(72, "La contraseña no puede superar 72 caracteres"),

    telefono: z
        .string()
        .trim()
        .min(8, "El teléfono debe tener al menos 8 caracteres")
        .max(20, "El teléfono no puede superar 20 caracteres"),
});

export const loginSchema = z.object({
    email: z
        .email("El correo electrónico no es válido")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(1, "La contraseña es obligatoria"),
});

export const updatePerfilSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(120, "El nombre no puede superar 120 caracteres"),

    apellidos: z
        .string()
        .trim()
        .min(2, "Los apellidos deben tener al menos 2 caracteres")
        .max(170, "Los apellidos no pueden superar 170 caracteres"),

    email: z
        .email("El correo electrónico no es válido")
        .trim()
        .toLowerCase()
        .max(150, "El correo no puede superar 150 caracteres"),

    telefono: z
        .string()
        .trim()
        .min(8, "El teléfono debe tener al menos 8 caracteres")
        .max(20, "El teléfono no puede superar 20 caracteres"),
});

export const cambiarRolSchema = z.object({
    role: z.nativeEnum(Role),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdatePerfilDto = z.infer<typeof updatePerfilSchema>;
export type CambiarRolDto = z.infer<typeof cambiarRolSchema>;
