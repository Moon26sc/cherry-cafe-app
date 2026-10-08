import { Routes } from '@angular/router';

// Imports del Cliente
import { LayoutComponent } from './features/storefront/layout/layout';
import { InicioComponent } from './features/storefront/pages/inicio/inicio';
import { MenuComponent } from './features/storefront/pages/menu/menu';
import { PedidoComponent } from './features/storefront/pages/pedido/pedido';

// Imports del Administrador (con Alias para el Layout)
import { LayoutComponent as AdminLayout } from './features/admin/layout/layout';
import { DashboardComponent } from './features/admin/pages/dashboard/dashboard';
import { ProductosComponent } from './features/admin/pages/productos/productos';

import { LayoutComponent as AuthLayout } from './features/auth/layout/layout';
import { LoginComponent } from './features/auth/pages/login/login';
import { RegistroComponent } from './features/auth/pages/registro/registro';

export const routes: Routes = [
  // ================= ZONA DEL CLIENTE =================
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'pedido', component: PedidoComponent }
    ]
  },
  
  // ================= ZONA ADMINISTRATIVA =================
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productos', component: ProductosComponent }
    ]
  },


  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegistroComponent }
    ]
  },

  
  { path: '**', redirectTo: 'inicio' }
];