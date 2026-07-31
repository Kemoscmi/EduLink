import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.autenticado()) {
    return true;
  }

  if (!authService.obtenerToken()) {
    return router.createUrlTree(['/login']);
  }

  return authService
    .cargarPerfil()
    .pipe(map((usuario) => (usuario ? true : router.createUrlTree(['/login']))));
};
