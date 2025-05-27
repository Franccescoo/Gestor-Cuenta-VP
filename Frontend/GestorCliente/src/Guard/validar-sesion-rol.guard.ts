import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Service/auth.service';

export const validarSesionRolGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>; // Lista de roles requeridos
  const isAuthenticated = authService.isAuthenticated();
  const userRole: string | null = authService.getRoleFromToken(); // userRole puede ser null

  if (!isAuthenticated) {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false;
  }

  if (requiredRoles && (!userRole || !requiredRoles.includes(userRole))) {
    // Si no tiene un rol válido o el rol no está en la lista, redirige
    alert('No tienes permiso para acceder a esta sección.');

    //router.navigate(['/']);
    return false;
  }

  return true; // Si está autenticado y tiene uno de los roles requeridos, permite el acceso
};
