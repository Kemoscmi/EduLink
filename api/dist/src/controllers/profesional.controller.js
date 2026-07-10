import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/http-response";
import { profesionalService } from "../services/profesional.service";
export class ProfesionalController {
    listar = async (request, response, next) => {
        try {
            const { page, limit, nombre, modalidad, disponible } = request.query;
            const profesionales = await profesionalService.listar(Number(page) || 1, Number(limit) || 0, nombre, modalidad, disponible !== undefined
                ? disponible === "true"
                : undefined);
            return response.status(StatusCodes.OK).json({
                success: true,
                data: profesionales
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    obtenerPorId = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            const profesional = await profesionalService.obtenerPorId(id);
            if (!profesional) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Profesional no encontrado"
                });
            }
            return response.status(StatusCodes.OK).json({
                success: true,
                data: profesional
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    crear = async (request, response, next) => {
        try {
            const profesional = await profesionalService.crear(request.body);
            return response.status(StatusCodes.CREATED).json({
                success: true,
                data: profesional
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    };
    actualizar = async (request, response, next) => {
        const profesional = await profesionalService.actualizar(Number(request.params.id), request.body);
        return sendSuccess(response, profesional, "Profesional actualizado correctamente", StatusCodes.OK);
    };
    cambiarDisponibilidad = async (request, response, next) => {
        try {
            const profesional = await profesionalService.cambiarDisponibilidad(Number(request.params.id));
            return sendSuccess(response, profesional, "Disponibilidad actualizada correctamente", StatusCodes.OK);
        }
        catch (error) {
            next(error);
        }
    };
}
