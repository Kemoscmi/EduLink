import { Router } from "express";
import { ProfesionalController } from "../controllers/profesional.controller";

export class ProfesionalRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new ProfesionalController()
        //Rutas 
        //locahost:3000/profesional/ 
        //Listar Profesionales
        router.get('/', controller.listar)

        //Vista Detalle Profesional
        router.get("/:id", controller.obtenerPorId);

        //Crear un profesional
        router.post(
            "/",
            controller.crear
        );
        return router
    }
} 