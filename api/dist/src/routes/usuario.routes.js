import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
export class UsuarioRoutes {
    static get routes() {
        const router = Router();
        const controller = new UsuarioController();
        //ruta lista: get  http://localhost:3000/usuarios
        router.get("/", controller.listar);
        //ruta cambiar estado: path http://localhost:3000/usuarios/1/estado
        router.patch("/:id/estado", controller.cambiarEstado);
        return router;
    }
}
