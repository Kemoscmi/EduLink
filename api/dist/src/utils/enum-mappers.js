import { EstadoCita, Modalidad, Role } from "../../generated/prisma/enums";
//Estado de las Órdenes
export const EstadoOrdenMap = {
    [EstadoCita.PENDIENTE]: "Pendiente de Pago",
    [EstadoCita.PAGADA]: "Pagada",
    [EstadoCita.REALIZADA]: "Realizada",
    [EstadoCita.CANCELADA]: "Cancelada"
};
// Roles
export const RoleMap = {
    [Role.USER]: "Cliente",
    [Role.ADMIN]: "Administrador",
    [Role.TUTOR]: "Profesional"
};
//Modalidades
export const ModalidadesMap = {
    [Modalidad.MIXTA]: "Mixta",
    [Modalidad.PRESENCIAL]: "Presencial",
    [Modalidad.VIRTUAL]: "Virtual"
};
/**
 * Convierte un diccionario de mapas en un array de opciones
 */
export function getEnumOptions(map) {
    return Object.entries(map).map(([value, label]) => ({
        value,
        label: label
    }));
}
