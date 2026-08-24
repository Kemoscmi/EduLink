import { Router } from "express";
import { ServicioController } from "../controllers/servicio.controller";
import {
  createServicioSchema,
  updateServicioSchema,
} from "../dtos/servicio.dto";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export class ServicioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ServicioController();

    router.get("/", authMiddleware, asyncHandler(controller.listar));

    router.get("/:id", authMiddleware, asyncHandler(controller.obtenerPorId));

    router.post(
      "/",
      authMiddleware,
      validateRequest(createServicioSchema),
      asyncHandler(controller.crear)
    );

    router.put(
      "/:id",
      authMiddleware,
      validateRequest(updateServicioSchema),
      asyncHandler(controller.editar)
    );

    router.patch(
      "/:id/estado",
      authMiddleware,
      asyncHandler(controller.cambiarEstado)
    );

    return router;
  }
}