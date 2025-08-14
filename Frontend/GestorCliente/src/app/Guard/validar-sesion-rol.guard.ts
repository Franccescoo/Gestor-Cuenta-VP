import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Service/auth.service';

export const validarSesionRolGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedIssuer = route.data?.['issuer'] as string | undefined; // opcional por ruta
  const payload = auth.getPayload();

  if (!auth.isPayloadValid(payload, expectedIssuer)) {
    auth.logout();
    router.navigate(['/iniciar-sesion']);
    return false;
  }

  const required = route.data?.['roles'] as string[] | undefined;
  if (required?.length) {
    const roles = (payload?.authorities && (Array.isArray(payload.authorities) ? payload.authorities : [payload.authorities])) || [];
    const ok = required.some(r => roles.map(x => x.toUpperCase()).includes(r.toUpperCase()));
    if (!ok) {
      alert('No tienes permiso para acceder a esta sección.');
      return false;
    }
  }
  return true;
};

