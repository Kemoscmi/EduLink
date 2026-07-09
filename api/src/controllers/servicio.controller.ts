import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { servicioService } from "../services/servicio.service";
import { sendSuccess } from "../utils/http-response";
import { AppError } from "../utils/app-error";

export class ServicioController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const servicios = await servicioService.listar();
    return sendSuccess(response, servicios);
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.id);
    const servicio = await servicioService.obtenerPorId(id);

    if (!servicio) {
      throw AppError.notFound("Servicio no encontrado");
    }

    return sendSuccess(response, servicio);
  };

  crear = async (request: Request, response: Response, next: NextFunction) => {
    const servicio = await servicioService.crear(request.body);
    return sendSuccess(response, servicio, "Servicio creado correctamente", StatusCodes.CREATED);
  };

  editar = async (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.id);
    const servicio = await servicioService.editar(id, request.body);
    return sendSuccess(response, servicio, "Servicio actualizado correctamente");
  };

  cambiarEstado = async (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.id);
    const servicio = await servicioService.cambiarEstado(id);

    return sendSuccess(
      response,
      servicio,
      servicio.activo ? "Servicio activado correctamente" : "Servicio desactivado correctamente"
    );
  };
}
