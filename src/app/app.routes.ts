import { Routes } from '@angular/router';

// Importamos los componentes que acabas de generar
import { LayoutComponent } from './features/storefront/layout/layout';
import { InicioComponent } from './features/storefront/pages/inicio/inicio';
import { MenuComponent } from './features/storefront/pages/menu/menu';

export const routes: Routes = [
  {
    // Ruta padre del Storefront (El entorno del cliente)
    path: '',
    component: LayoutComponent,
    children: [
      // Redirección por defecto al entrar a localhost:4200
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      
      // Las páginas internas que cambian
      { path: 'inicio', component: InicioComponent },
      { path: 'menu', component: MenuComponent }
    ]
  },
  
  // Aquí agregaremos en el futuro la zona administrativa protegida
  // { path: 'admin', component: AdminLayoutComponent, children: [...] },

  // Ruta comodín (Catch-all): Si el usuario escribe una URL que no existe, lo devuelve al inicio
  { path: '**', redirectTo: 'inicio' }
];