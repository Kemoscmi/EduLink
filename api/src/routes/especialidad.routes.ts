import { Router } from "express";
import { EspecialidadController } from "../controllers/especialidad.controller";

export class EspecialidadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new EspecialidadController();
//rutas GET http://localhost:3000/especialidades
    router.get("/", controller.listar);
//rutas PATCH http://localhost:3000/especialidades/1/estado
    router.patch("/:id/estado", controller.cambiarEstado);

    return router;
  }
}
