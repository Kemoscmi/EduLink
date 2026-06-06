import { prisma } from "../config/prisma"; 
 
export const perfilTutorService = { 
    async listar() { 
        return await prisma.perfilTutor.findMany(); 
    }, 
};