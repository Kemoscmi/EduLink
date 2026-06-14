import { Router } from "express";
import { CitaController } from "../controllers/cita.controller";

export class CitaRoutes {
    static get routes(): Router {

        const router = Router();
        const controller = new CitaController();

        // localhost:3000/citas/

        // Listado de citas
        router.get('/', controller.listar);

        // Vista detalle de una cita
        router.get('/:id', controller.obtenerPorId);

        return router;
    }
}