import { Routes } from '@angular/router';

import { LayoutComponent } from './features/storefront/layout/layout';
import { InicioComponent } from './features/storefront/pages/inicio/inicio';
import { MenuComponent } from './features/storefront/pages/menu/menu';
import { PedidoComponent } from './features/storefront/pages/pedido/pedido';
import { NosotrosComponent } from './features/storefront/pages/nosotros/nosotros';
import { adminGuard } from './core/guards/admin-guard';

import { LayoutComponent as AdminLayout } from './features/admin/layout/layout';
import { DashboardComponent } from './features/admin/pages/dashboard/dashboard';
import { ProductosComponent } from './features/admin/pages/productos/productos';
import { MisPedidosComponent } from './features/storefront/pages/mis-pedidos/mis-pedidos'; 
import { PedidosEntrantesComponent } from './features/admin/pages/pedidos-entrantes/pedidos-entrantes';
import { UsuariosComponent } from './features/admin/pages/usuarios/usuarios';

import { LayoutComponent as AuthLayout } from './features/auth/layout/layout';
import { LoginComponent } from './features/auth/pages/login/login';
import { RegistroComponent } from './features/auth/pages/registro/registro';


export const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      children: [
        { path: '', redirectTo: 'inicio', pathMatch: 'full' },
        { path: 'inicio', component: InicioComponent },
        { path: 'menu', component: MenuComponent },
        { path: 'pedido', component: PedidoComponent },
        { path: 'nosotros', component: NosotrosComponent },
        { path: 'mis-pedidos', component: MisPedidosComponent }
      ]
    },
    
 
  
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard], 
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'pedidos', component: PedidosEntrantesComponent }, 
      { path: 'usuarios', component: UsuariosComponent }         
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