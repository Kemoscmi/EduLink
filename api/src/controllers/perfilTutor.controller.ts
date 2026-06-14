import { Request, Response, NextFunction } from 'express'; 
import { StatusCodes } from "http-status-codes"; 
import { perfilTutorService } from '../services/perfilTutor.service'; 

export class PerfilTutorController { 
    listar = async (request: Request, response: Response, next: NextFunction) => { 
        try { 
            const perfilesTutor = await perfilTutorService.listar();

            return response.status(StatusCodes.OK).json({ 
                success: true, 
                data: perfilesTutor, 
            }); 
        } catch (error) { 
            console.error(error); 
            next(error); 
        } 
    }; 
}