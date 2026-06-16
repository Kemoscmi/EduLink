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
import { Router } from 'express'; 
import {ProfesionalRoutes } from './profesional.routes'; 
import { CitaRoutes } from './cita.routes';
 
export class AppRoutes { 
    static get routes(): Router { 
        const router = Router(); 
        // ----Agregar las rutas---- 
        router.use('/citas', CitaRoutes.routes)
        router.use('/profesionales', ProfesionalRoutes.routes)        
        return router; 
    } 
} 
