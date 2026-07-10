import { Router } from "express";
import { CitaController } from "../controllers/cita.controller";
import { createCitaSchema } from "../dtos/cita.dto";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
export class CitaRoutes {
    static get routes() {
        const router = Router();
        const controller = new CitaController();
        // localhost:3000/citas/
        // Listado de citas
        router.get('/', controller.listar);
        // Vista detalle de una cita
        router.get('/:id', controller.obtenerPorId);
        // Crear una cita
        router.post("/", validateRequest(createCitaSchema), asyncHandler(controller.crear));
        return router;
    }
}
