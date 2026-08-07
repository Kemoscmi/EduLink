import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { reportesService } from "../services/reportes.service";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export class ReportesController {
  private async getTutorIdForUser(usuarioId: number): Promise<number> {
    const tutor = await prisma.perfilTutor.findFirst({
      where: { usuarioId }
    });
    if (!tutor) {
      throw AppError.notFound("No se encontró el perfil de profesional para este usuario.");
    }
    return tutor.id;
  }

  citasPorEstado = async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.user) {
        throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
      }

      let tutorId: number | undefined = undefined;

      if (request.user.role === "TUTOR") {
        tutorId = await this.getTutorIdForUser(request.user.id);
      } else if (request.user.role === "ADMIN") {
        if (request.query.tutorId) {
          tutorId = Number(request.query.tutorId);
        }
      } else {
        throw AppError.forbidden("No tiene permisos para acceder a este reporte");
      }

      const categoriaId = request.query.categoriaId ? Number(request.query.categoriaId) : undefined;
      const fechaInicio = request.query.fechaInicio ? new Date(request.query.fechaInicio as string) : undefined;
      const fechaFin = request.query.fechaFin ? new Date(request.query.fechaFin as string) : undefined;

      const report = await reportesService.getCitasPorEstado({
        tutorId,
        categoriaId,
        fechaInicio,
        fechaFin
      });

      return response.status(StatusCodes.OK).json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  };

  citasPorProfesional = async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.user) {
        throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
      }

      let tutorId: number | undefined = undefined;

      if (request.user.role === "TUTOR") {
        tutorId = await this.getTutorIdForUser(request.user.id);
      } else if (request.user.role !== "ADMIN") {
        throw AppError.forbidden("No tiene permisos para acceder a este reporte");
      }

      const report = await reportesService.getCitasPorProfesional(tutorId);

      return response.status(StatusCodes.OK).json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  };

  calificaciones = async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.user) {
        throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
      }

      let tutorId: number | undefined = undefined;

      if (request.user.role === "TUTOR") {
        tutorId = await this.getTutorIdForUser(request.user.id);
      } else if (request.user.role !== "ADMIN") {
        throw AppError.forbidden("No tiene permisos para acceder a este reporte");
      }

      const report = await reportesService.getCalificacionesReport(tutorId);

      return response.status(StatusCodes.OK).json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  };
}
