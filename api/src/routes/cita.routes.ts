import { Router } from "express";
import { CitaController } from "../controllers/cita.controller";
import {
    createCitaSchema,
    aceptarCitaSchema,
    rechazarCitaSchema,
    cancelarCitaSchema,
    createResenaSchema
} from "../dtos/cita.dto";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export class CitaRoutes {
    static get routes(): Router {

        const router = Router();
        const controller = new CitaController();

        // localhost:3000/citas/

        // Citas del usuario autenticado (cliente ve las suyas, profesional ve las suyas)
        router.get('/mias', authMiddleware, asyncHandler(controller.misCitas));

        // Listado de citas
        router.get('/', authMiddleware, controller.listar);

        // Historial de cambios de estado de una cita
        router.get('/:id/historial', authMiddleware, asyncHandler(controller.historial));

        // Vista detalle de una cita
        router.get('/:id', authMiddleware, controller.obtenerPorId);

        // Crear una cita
        router.post("/",
            authMiddleware,
            validateRequest(createCitaSchema),
            asyncHandler(controller.crear)
        )

        // Pendiente -> Aceptada (profesional asignado)
        router.patch('/:id/aceptar',
            authMiddleware,
            validateRequest(aceptarCitaSchema),
            asyncHandler(controller.aceptar)
        );

        // Pendiente -> Rechazada (profesional asignado, motivo obligatorio)
        router.patch('/:id/rechazar',
            authMiddleware,
            validateRequest(rechazarCitaSchema),
            asyncHandler(controller.rechazar)
        );

        // Pendiente/Aceptada -> Cancelada (cliente o profesional dueños, motivo obligatorio)
        router.patch('/:id/cancelar',
            authMiddleware,
            validateRequest(cancelarCitaSchema),
            asyncHandler(controller.cancelar)
        );

        // Aceptada -> Completada (profesional asignado, solo después de la fecha/hora programadas)
        router.patch('/:id/completar',
            authMiddleware,
            asyncHandler(controller.completar)
        );

        // Registrar reseña (Completada, cliente dueño, una única reseña)
        router.post('/:id/resena',
            authMiddleware,
            validateRequest(createResenaSchema),
            asyncHandler(controller.crearResena)
        );

        return router;
    }
}
