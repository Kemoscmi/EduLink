import { StatusCodes } from "http-status-codes";
import { especialidadService } from "../services/especialidad.service";
export class EspecialidadController {
    listar = async (request, response, next) => {
        try {
            const especialidades = await especialidadService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: especialidades,
            });
        }
        catch (error) {
            next(error);
        }
    };
    cambiarEstado = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            if (isNaN(id)) {
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "El id de la especialidad no es válido",
                });
            }
            const especialidad = await especialidadService.cambiarEstado(id);
            return response.status(StatusCodes.OK).json({
                success: true,
                message: especialidad.activo
                    ? "Especialidad activada correctamente"
                    : "Especialidad desactivada correctamente",
                data: especialidad,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
