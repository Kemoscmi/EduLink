import { EstadoCita, Modalidad, Role } from "../../generated/prisma/enums";

export interface EnumOption {
    value: string;
    label: string;
}

//Estado de las Citas
export const EstadoCitaMap: Record<EstadoCita, string> = {
    [EstadoCita.PENDIENTE]: "Pendiente",
    [EstadoCita.ACEPTADA]: "Aceptada",
    [EstadoCita.RECHAZADA]: "Rechazada",
    [EstadoCita.CANCELADA]: "Cancelada",
    [EstadoCita.COMPLETADA]: "Completada"
};

// Roles
export const RoleMap: Record<Role, string> = {
    [Role.USER]: "Cliente",
    [Role.ADMIN]: "Administrador",
    [Role.TUTOR]: "Profesional"
};

//Modalidades
export const ModalidadesMap: Record<Modalidad, string> = {
    [Modalidad.MIXTA]: "Mixta",
    [Modalidad.PRESENCIAL]: "Presencial",
    [Modalidad.VIRTUAL]: "Virtual"
    };
/**
 * Convierte un diccionario de mapas en un array de opciones
 */
export function getEnumOptions<T extends string>(map: Record<T, string>): EnumOption[] {
    return Object.entries(map).map(([value, label]) => ({
        value,
        label: label as string
    }));
}