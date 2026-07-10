import { StatusCodes } from "http-status-codes";
import { usuarioService } from "../services/usuario.service";
export class UsuarioController {
    listar = async (request, response, next) => {
        try {
            const usuarios = await usuarioService.listar();
            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuarios,
            });
        }
        catch (error) {
            next(error);
        }
    };
    cambiarEstado = async (request, response, next) => {
        try {
            const id = Number(request.params.id);
            if (isNaN(id)) {
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "El id del usuario no es válido",
                });
            }
            const usuario = await usuarioService.cambiarEstado(id);
            return response.status(StatusCodes.OK).json({
                success: true,
                message: usuario.activo
                    ? "Usuario activado correctamente"
                    : "Usuario desactivado correctamente",
                data: usuario,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
