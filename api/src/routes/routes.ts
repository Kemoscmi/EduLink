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