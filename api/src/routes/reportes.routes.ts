import { Router } from "express";
import { ReportesController } from "../controllers/reportes.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class ReportesRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ReportesController();

    router.get("/citas-estado", authMiddleware, asyncHandler(controller.citasPorEstado));
    router.get("/citas-profesional", authMiddleware, asyncHandler(controller.citasPorProfesional));
    router.get("/calificaciones", authMiddleware, asyncHandler(controller.calificaciones));

    return router;
  }
}
