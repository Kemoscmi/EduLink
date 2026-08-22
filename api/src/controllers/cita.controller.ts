import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { citaService } from "../services/cita.service";
import { EstadoCita } from "../../generated/prisma/enums";
import { sendSuccess } from "../utils/http-response";
import { profesionalService } from "../services/profesional.service";
import { AppError } from "../utils/app-error";
import { parseId } from "../utils/parse-id";

export class CitaController {

    misCitas = async (request: Request, response: Response) => {
        if (!request.user) {
            throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
        }

        const citas = await citaService.misCitas(request.user.id, request.user.role);
        return sendSuccess(response, citas);
    };

    historial = async (request: Request, response: Response) => {
        const id = parseId(request.params.id);
        const historial = await citaService.historial(id);
        return sendSuccess(response, historial);
    };

    aceptar = async (request: Request, response: Response) => {
        if (!request.user) {
            throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
        }

        const id = parseId(request.params.id);
        const cita = await citaService.aceptar(id, request.user, request.body.comentarioTutor);
        return sendSuccess(response, cita, "Cita aceptada correctamente");
    };

    rechazar = async (request: Request, response: Response) => {
        if (!request.user) {
            throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
        }

        const id = parseId(request.params.id);
        const cita = await citaService.rechazar(id, request.user, request.body.motivo);
        return sendSuccess(response, cita, "Cita rechazada correctamente");
    };

    cancelar = async (request: Request, response: Response) => {
        if (!request.user) {
            throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
        }

        const id = parseId(request.params.id);
        const cita = await citaService.cancelar(id, request.user, request.body.motivo);
        return sendSuccess(response, cita, "Cita cancelada correctamente");
    };

    completar = async (request: Request, response: Response) => {
        if (!request.user) {
            throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
        }

        const id = parseId(request.params.id);
        const cita = await citaService.completar(id, request.user);
        return sendSuccess(response, cita, "Cita marcada como completada");
    };

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
        try {
            const cita = await citaService.crear(request.body);

            return sendSuccess(
                response,
                cita,
                "Cita registrada correctamente",
                StatusCodes.CREATED
            );
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    crearResena = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) {
                throw AppError.unauthorized("Debe iniciar sesión para realizar esta acción");
            }
            const citaId = parseId(request.params.id);
            const { puntuacion, comentario } = request.body;

            const resena = await citaService.crearResena(
                citaId,
                request.user.id,
                Number(puntuacion),
                comentario
            );

            return sendSuccess(
                response,
                resena,
                "Reseña registrada correctamente",
                StatusCodes.CREATED
            );
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

}