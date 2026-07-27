import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Usuario } from '../models/usuario.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const rolesPermitidos = route.data['roles'] as Usuario['role'][] | undefined;

  if (!rolesPermitidos?.length) {
    return true;
  }

  if (authService.tieneRol(rolesPermitidos)) {
    return true;
  }

  return router.createUrlTree(['/sin-autorizacion']);
};
