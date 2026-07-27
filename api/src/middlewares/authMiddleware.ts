import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error";
import { Role } from "../../generated/prisma/enums";

interface JwtPayload {
    id: number;
    email: string;
    role: Role;
}

export function authMiddleware(request: Request, _response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        request.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };

        next();
    } catch {
        throw AppError.unauthorized("La sesión no es válida o ha vencido");
    }
}
