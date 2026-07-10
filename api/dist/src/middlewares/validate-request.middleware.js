import { AppError } from "../utils/app-error";
export function validateRequest(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const validationErrors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            throw AppError.badRequest("Datos de entrada inválidos", validationErrors);
        }
        req.body = result.data;
        next();
    };
}
