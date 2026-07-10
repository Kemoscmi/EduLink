import { StatusCodes } from "http-status-codes";
export function sendSuccess(res, data, message = "Operación realizada correctamente", statusCode = StatusCodes.OK) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
