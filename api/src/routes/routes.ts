import { Router } from "express";
import { PerfilTutorRoutes } from "./perfilTutor.routes";
import { UsuarioRoutes } from "./usuario.routes";
import { CategoriaRoutes } from "./categoria.routes";
import { ServicioRoutes } from "./servicio.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/perfilTutor", PerfilTutorRoutes.routes);
    router.use("/usuarios", UsuarioRoutes.routes);
    router.use("/categorias", CategoriaRoutes.routes);
    router.use("/servicios", ServicioRoutes.routes);

    return router;
  }
}