import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { servicioService } from "../services/servicio.service";
import { sendSuccess } from "../utils/http-response";
import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import { Role } from "../../generated/prisma/enums";

const obtenerTutorIdSiTutor = async (req: Request): Promise<number | undefined> => {
  if (req.user?.role === Role.TUTOR) {
    const tutor = await prisma.perfilTutor.findFirst({
      where: { usuarioId: req.user.id }
    });
    if (!tutor) {
      throw AppError.notFound("Perfil de profesional no encontrado");
    }
    return tutor.id;
  }
  return undefined;
};

export class ServicioController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = request.user;
      const servicios = await servicioService.listar(user?.id, user?.role);
      return sendSuccess(response, servicios);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = Number(request.params.id);
      const tutorIdForzado = await obtenerTutorIdSiTutor(request);
      const servicio = await servicioService.obtenerPorId(id, tutorIdForzado);

      if (!servicio) {
        throw AppError.notFound("Servicio no encontrado");
      }

      return sendSuccess(response, servicio);
    } catch (error) {
      next(error);
    }
  };

  crear = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const tutorIdForzado = await obtenerTutorIdSiTutor(request);
      const servicio = await servicioService.crear(request.body, tutorIdForzado);
      return sendSuccess(response, servicio, "Servicio creado correctamente", StatusCodes.CREATED);
    } catch (error) {
      next(error);
    }
  };

  editar = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = Number(request.params.id);
      const tutorIdForzado = await obtenerTutorIdSiTutor(request);
      const servicio = await servicioService.editar(id, request.body, tutorIdForzado);
      return sendSuccess(response, servicio, "Servicio actualizado correctamente");
    } catch (error) {
      next(error);
    }
  };

  cambiarEstado = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = Number(request.params.id);
      const tutorIdForzado = await obtenerTutorIdSiTutor(request);
      const servicio = await servicioService.cambiarEstado(id, tutorIdForzado);

      return sendSuccess(
        response,
        servicio,
        servicio.activo ? "Servicio activado correctamente" : "Servicio desactivado correctamente"
      );
    } catch (error) {
      next(error);
    }
  };
}
