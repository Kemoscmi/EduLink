import { Router } from 'express'; 
import { PerfilTutorRoutes } from './perfilTutor.routes'; 
import { CitaRoutes } from './cita.routes';
 
export class AppRoutes { 
    static get routes(): Router { 
        const router = Router(); 
        // ----Agregar las rutas---- 
        router.use('/perfilTutor', PerfilTutorRoutes.routes) 
        router.use('/citas', CitaRoutes.routes)        
        return router; 
    } 
} 