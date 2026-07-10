import { Router } from "express";
import { ServicioController } from "../controllers/servicio.controller";
import { createServicioSchema, updateServicioSchema, } from "../dtos/servicio.dto";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
export class ServicioRoutes {
    static get routes() {
        const router = Router();
        const controller = new ServicioController();
        router.get("/", asyncHandler(controller.listar));
        router.get("/:id", asyncHandler(controller.obtenerPorId));
        router.post("/", validateRequest(createServicioSchema), asyncHandler(controller.crear));
        router.put("/:id", validateRequest(updateServicioSchema), asyncHandler(controller.editar));
        router.patch("/:id/estado", asyncHandler(controller.cambiarEstado));
        return router;
    }
}
