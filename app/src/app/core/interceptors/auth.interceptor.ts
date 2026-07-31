import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthenticationService);
  const token = authService.obtenerToken();

  if (!token) {
    return next(request);
  }

  const requestConToken = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(requestConToken);
};
