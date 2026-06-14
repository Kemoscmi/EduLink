import { EstadoCita, Modalidad, Role } from "../../generated/prisma/enums";

export interface EnumOption {
    value: string;
    label: string;
}

//Estado de las Órdenes
export const EstadoOrdenMap: Record<EstadoCita, string> = {
    [EstadoCita.PENDIENTE]: "Pendiente de Pago",
    [EstadoCita.PAGADA]: "Pagada",
    [EstadoCita.REALIZADA]: "Realizada",
    [EstadoCita.CANCELADA]: "Cancelada"
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