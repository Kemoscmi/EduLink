import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
export class CategoriaRoutes {
    static get routes() {
        const router = Router();
        const controller = new CategoriaController();
        //rutas GET http://localhost:3000/categorias 
        router.get("/", controller.listar);
        //rutas PATCH http://localhost:3000/categorias/1/estado
        router.patch("/:id/estado", controller.cambiarEstado);
        return router;
    }
}
