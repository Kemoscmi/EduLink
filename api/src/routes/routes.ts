import { Router } from 'express'; 
import { PerfilTutorRoutes } from './perfilTutor.routes'; 
 
export class AppRoutes { 
    static get routes(): Router { 
        const router = Router(); 
        // ----Agregar las rutas---- 
        router.use('/perfilTutor', PerfilTutorRoutes.routes)         
        return router; 
    } 
} 