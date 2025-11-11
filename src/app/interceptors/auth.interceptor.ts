import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si existe token y no es una petición de login/register, agregar header de autorización
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('🔐 Interceptor: Agregando token a la petición', {
      url: req.url,
      method: req.method,
      hasToken: !!token
    });

    return next(clonedRequest);
  }

  // Si es login/register, no agregar token
  if (req.url.includes('/auth/')) {
    console.log('🔓 Interceptor: Petición de autenticación, sin token', req.url);
  }

  return next(req);
};
