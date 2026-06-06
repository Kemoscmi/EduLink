import { Router } from "express"; 
import { PerfilTutorController } from "../controllers/perfilTutor.controller"; 
 
export class PerfilTutorRoutes { 
    static get routes(): Router { 
        const router = Router() 
        const controller = new PerfilTutorController() 
        //Rutas 
        //locahost:3000/perfilTutor/ 
        router.get('/', controller.listar) 
        return router 
    } 
} 