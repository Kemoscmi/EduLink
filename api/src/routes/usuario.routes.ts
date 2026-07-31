import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { registerSchema, loginSchema, updatePerfilSchema, cambiarRolSchema } from "../dtos/usuario.dto";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export class UsuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UsuarioController();

    //ruta lista: get  http://localhost:3000/usuarios
    router.get("/", asyncHandler(controller.listar));

    //ruta registro público: post http://localhost:3000/usuarios/register
    router.post(
      "/register",
      validateRequest(registerSchema),
      asyncHandler(controller.registrar)
    );

    //ruta login: post http://localhost:3000/usuarios/login
    router.post(
      "/login",
      validateRequest(loginSchema),
      asyncHandler(controller.login)
    );

    //ruta perfil del usuario autenticado: get http://localhost:3000/usuarios/perfil
    router.get("/perfil", authMiddleware, asyncHandler(controller.perfil));

    //ruta editar perfil del usuario autenticado: patch http://localhost:3000/usuarios/perfil
    router.patch(
      "/perfil",
      authMiddleware,
      validateRequest(updatePerfilSchema),
      asyncHandler(controller.actualizarPerfil)
    );

    //ruta cambiar estado: patch http://localhost:3000/usuarios/1/estado
    router.patch("/:id/estado", asyncHandler(controller.cambiarEstado));

    //ruta cambiar rol (solo administrador desde el Frontend): patch http://localhost:3000/usuarios/1/rol
    router.patch(
      "/:id/rol",
      validateRequest(cambiarRolSchema),
      asyncHandler(controller.cambiarRol)
    );

    return router;
  }
}
