import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const guardado = localStorage.getItem('cherry_user');
  const usuario = guardado ? JSON.parse(guardado) : null;
  return usuario && usuario.rol === 'ADMIN' ? true : router.createUrlTree(['/auth/login']);
};