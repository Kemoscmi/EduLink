import { Router } from "express";
import { UsuarioRoutes } from "./usuario.routes";
import { CategoriaRoutes } from "./categoria.routes";
import { EspecialidadRoutes } from "./especialidad.routes";
import { ServicioRoutes } from "./servicio.routes";
import { CitaRoutes } from "./cita.routes";
import { ProfesionalRoutes } from "./profesional.routes";
export class AppRoutes {
    static get routes() {
        const router = Router();
        router.use("/usuarios", UsuarioRoutes.routes);
        router.use("/categorias", CategoriaRoutes.routes);
        router.use("/especialidades", EspecialidadRoutes.routes);
        router.use("/servicios", ServicioRoutes.routes);
        router.use('/citas', CitaRoutes.routes);
        router.use('/profesionales', ProfesionalRoutes.routes);
        return router;
    }
}
