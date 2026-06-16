import { Request, Response, NextFunction } from "express";
import { servicioService } from "../services/servicio.service";

export class ServicioController {
  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const servicios = await servicioService.listar();
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const servicio = await servicioService.obtenerPorId(id);

      if (!servicio) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }

      res.json(servicio);
    } catch (error) {
      next(error);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const servicio = await servicioService.crear(req.body);
      res.status(201).json(servicio);
    } catch (error) {
      next(error);
    }
  };

  editar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const servicio = await servicioService.editar(id, req.body);
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  };

  cambiarEstado = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const servicio = await servicioService.cambiarEstado(id);
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  };
}