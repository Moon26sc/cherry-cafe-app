import { Routes } from '@angular/router';
import { LayoutComponent } from './features/storefront/layout/layout';
import { InicioComponent } from './features/storefront/pages/inicio/inicio';
import { MenuComponent } from './features/storefront/pages/menu/menu';
import { PedidoComponent } from './features/storefront/pages/pedido/pedido'; // <- NUEVO

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'pedido', component: PedidoComponent } // <- NUEVA RUTA
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];