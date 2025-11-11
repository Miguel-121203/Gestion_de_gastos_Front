import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ AuthGuard: Verificando acceso a:', state.url);

  const isLoggedIn = authService.isLoggedIn();

  // Verificar si el usuario está autenticado
  if (isLoggedIn) {
    console.log('✅ AuthGuard: Acceso permitido');
    return true;
  }

  // Si no está autenticado, redirigir al login
  console.log('❌ AuthGuard: Acceso denegado. Redirigiendo al login...');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
