import { StatusCodes } from "http-status-codes";
export class AppError extends Error {
    name;
    statusCode;
    isOperational;
    validationErrors;
    constructor(args) {
        super(args.message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name ?? "ApplicationError";
        this.statusCode = args.statusCode;
        this.isOperational = args.isOperational ?? true;
        this.validationErrors = args.validationErrors;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, validationErrors) {
        return new AppError({
            name: "BadRequestError",
            message,
            statusCode: StatusCodes.BAD_REQUEST,
            validationErrors,
        });
    }
    static unauthorized(message = "No autorizado") {
        return new AppError({
            name: "UnauthorizedError",
            message,
            statusCode: StatusCodes.UNAUTHORIZED,
        });
    }
    static forbidden(message = "Acceso denegado") {
        return new AppError({
            name: "ForbiddenError",
            message,
            statusCode: StatusCodes.FORBIDDEN,
        });
    }
    static notFound(message = "Recurso no encontrado") {
        return new AppError({
            name: "NotFoundError",
            message,
            statusCode: StatusCodes.NOT_FOUND,
        });
    }
    static conflict(message = "Conflicto con el estado actual del recurso") {
        return new AppError({
            name: "ConflictError",
            message,
            statusCode: StatusCodes.CONFLICT,
        });
    }
    static internalServer(message = "Se produjo un error interno del servidor") {
        return new AppError({
            name: "InternalServerError",
            message,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            isOperational: false,
        });
    }
}
