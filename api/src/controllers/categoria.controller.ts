import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { categoriaService } from "../services/categoria.service";

export class CategoriaController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categorias = await categoriaService.listar();

      return response.status(StatusCodes.OK).json({
        success: true,
        data: categorias,
      });
    } catch (error) {
      next(error);
    }
  };

  cambiarEstado = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(request.params.id);

      if (isNaN(id)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "El id de la categoría no es válido",
        });
      }

      const categoria = await categoriaService.cambiarEstado(id);

      return response.status(StatusCodes.OK).json({
        success: true,
        message: categoria.activo
          ? "Categoría activada correctamente"
          : "Categoría desactivada correctamente",
        data: categoria,
      });
    } catch (error) {
      next(error);
    }
  };
}