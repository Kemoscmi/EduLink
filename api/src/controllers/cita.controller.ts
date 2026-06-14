import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { citaService } from "../services/cita.service";
import { EstadoCita } from "../../generated/prisma/enums";
import { sendSuccess } from "../utils/http-response";

export class CitaController {

    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            //Para recibir los datos de la petición HTTP con los filtros de estado, profesional y rango de fechas. 
            const {
                page,
                limit,
                estado,
                tutorId,
                fechaInicio,
                fechaFin
            } = request.query;

            const citas = await citaService.listar(
                Number(page) || 1,
                Number(limit) || 0,
                estado as EstadoCita,
                tutorId ? Number(tutorId) : undefined,
                fechaInicio ? new Date(fechaInicio as string) : undefined,
                fechaFin ? new Date(fechaFin as string) : undefined
            );

            return response.status(StatusCodes.OK).json({
                success: true,
                data: citas
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {

            const id = Number(request.params.id);

            const cita = await citaService.obtenerPorId(id);

            //En caso de que no exista alguna cita con ese ID
            if (!cita) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Cita no encontrada"
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: cita
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };
    crear = async (request: Request, response: Response, next: NextFunction) => {

        const cita = await citaService.crear(request.body);

        return sendSuccess(
            response,
            cita,
            "Cita creada correctamente",
            StatusCodes.CREATED
        );
    };

}