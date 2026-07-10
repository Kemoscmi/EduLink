import { AppError } from "./app-error";
export function parseId(rawId) {
    const idValue = Array.isArray(rawId)
        ? rawId[0]
        : rawId;
    const numericId = Number(idValue);
    if (!idValue || Number.isNaN(numericId) || numericId <= 0) {
        throw AppError.badRequest("El id recibido no es válido");
    }
    return numericId;
}
