import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  // NOTA: datos de ejemplo. Cuando esté la base de datos, se cargarán desde la API PHP.
  resumen = [
    { titulo: 'Productos', valor: '24', icono: 'bi-box-seam', detalle: '3 no disponibles' },
    { titulo: 'Pedidos de hoy', valor: '18', icono: 'bi-receipt', detalle: '+4 respecto a ayer' },
    { titulo: 'Clientes', valor: '132', icono: 'bi-people', detalle: '9 nuevos esta semana' },
    { titulo: 'Ventas de hoy', valor: 'S/ 486.50', icono: 'bi-cash-stack', detalle: 'Ticket promedio S/ 27.03' }
  ];

  ultimosPedidos = [
    { id: 1024, cliente: 'María López', total: 32.5, estado: 'Pendiente' },
    { id: 1023, cliente: 'Carlos Ramírez', total: 18.0, estado: 'En preparación' },
    { id: 1022, cliente: 'Ana Torres', total: 45.9, estado: 'Entregado' },
    { id: 1021, cliente: 'Luis Fernández', total: 12.5, estado: 'Entregado' },
    { id: 1020, cliente: 'Sofía Castro', total: 27.0, estado: 'Cancelado' }
  ];

  masVendidos = [
    { nombre: 'Cappuccino', ventas: 42 },
    { nombre: 'Latte', ventas: 35 },
    { nombre: 'Cheesecake', ventas: 21 },
    { nombre: 'Croissant', ventas: 17 }
  ];

  // El producto más vendido marca el 100% de la barra; el resto se calcula en proporción
  get maxVentas(): number {
    return Math.max(...this.masVendidos.map(p => p.ventas));
  }

  claseEstado(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'estado-pendiente';
      case 'En preparación': return 'estado-preparacion';
      case 'Entregado': return 'estado-entregado';
      default: return 'estado-cancelado';
    }
  }
}
