import { inject } from '@angular/core'
import {
    HttpErrorResponse,
    HttpInterceptorFn,
} from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import { NotificationService } from '../services/notification.service'
import { AuthenticationService } from '../services/authentication.service'

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
    const noti = inject(NotificationService)
    const authService = inject(AuthenticationService)

    console.log('Request URL:', request.url)

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            // Una petición autenticada (con token) que responde 401 significa que el
            // token es inválido o venció. Se cierra la sesión y se avisa al usuario,
            // en vez de mostrarle el mensaje genérico de "No autorizado".
            if (error.status === 401 && request.headers.has('Authorization')) {
                authService.logout(true)
                noti.error('Su sesión ha vencido. Por favor inicie sesión nuevamente.', 'Sesión expirada', 6000)
                return throwError(() => error)
            }

            let message = 'Se presentó un error inesperado'

            if (error.error instanceof ErrorEvent) {
                message = `Error del cliente: ${error.error.message}`
            } else if (error.error?.message && error.status !== 500) {
                // El backend (AppError) ya trae un mensaje claro y específico (ej. "Ya existe un servicio con ese nombre")
                message = error.error.message
            } else {
                switch (error.status) {
                    case 0:
                        message = 'No se pudo conectar con el servidor'
                        break
                    case 400:
                        message = 'Solicitud incorrecta'
                        break
                    case 401:
                        message = 'No autorizado'
                        break
                    case 403:
                        message = 'Acceso denegado'
                        break
                    case 404:
                        message = 'Recurso no encontrado'
                        break
                    case 409:
                        message = 'El registro ya existe o está en conflicto con datos actuales'
                        break
                    case 422:
                        message = 'Los datos enviados no son válidos'
                        break
                    case 500:
                        message = 'Error interno del servidor'
                        break
                    case 503:
                        message = 'Servicio no disponible'
                        break
                }
            }
            noti.error(message, `Error ${error.status}`, 5000)
            return throwError(() => error)
        })
    )
}