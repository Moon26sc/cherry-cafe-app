import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Usamos la clave exacta que encontramos en tu Local Storage
  const userData = localStorage.getItem('cherry_user'); 

  if (userData) {
    const user = JSON.parse(userData);
    
    // Evaluamos si tiene un rol de colaborador válido
    if (user.rol === 'ADMIN' || user.rol === 'CAJERO' || user.rol === 'BARISTA') {
      return true;
    }
  }

  // Si no hay sesión o es cliente, lo regresamos a la tienda
  router.navigate(['/inicio']);
  return false;
};