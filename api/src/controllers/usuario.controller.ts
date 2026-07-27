import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { usuarioService } from "../services/usuario.service";
import { sendSuccess } from "../utils/http-response";
import { AppError } from "../utils/app-error";
import { parseId } from "../utils/parse-id";

export class UsuarioController {
    listar = async (_request: Request, response: Response) => {
        const usuarios = await usuarioService.listar();
        return sendSuccess(response, usuarios);
    };

    cambiarEstado = async (request: Request, response: Response) => {
        const id = parseId(request.params.id);
        const usuario = await usuarioService.cambiarEstado(id);

        return sendSuccess(
            response,
            usuario,
            usuario.activo ? "Usuario activado correctamente" : "Usuario desactivado correctamente"
        );
    };

    cambiarRol = async (request: Request, response: Response) => {
        const id = parseId(request.params.id);
        const usuario = await usuarioService.cambiarRol(id, request.body);

        return sendSuccess(response, usuario, "Rol actualizado correctamente");
    };

    registrar = async (request: Request, response: Response) => {
        const usuario = await usuarioService.registrar(request.body);
        return sendSuccess(response, usuario, "Usuario registrado correctamente", StatusCodes.CREATED);
    };

    login = async (request: Request, response: Response) => {
        const { usuario, token } = await usuarioService.login(request.body);
        return sendSuccess(response, { usuario, token }, "Inicio de sesión exitoso");
    };

    perfil = async (request: Request, response: Response) => {
        if (!request.user) {
            throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
        }

        const usuario = await usuarioService.obtenerPerfil(request.user.id);
        return sendSuccess(response, usuario);
    };

    actualizarPerfil = async (request: Request, response: Response) => {
        if (!request.user) {
            throw AppError.unauthorized("Debe iniciar sesión para acceder a este recurso");
        }

        const usuario = await usuarioService.actualizarPerfil(request.user.id, request.body);
        return sendSuccess(response, usuario, "Perfil actualizado correctamente");
    };
}
