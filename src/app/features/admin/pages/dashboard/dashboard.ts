import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../../../core/services/pedido'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  ultimosPedidos: any[] = [];
  
  resumen = [
    { titulo: 'Productos', valor: '24', icono: 'bi-box-seam', detalle: '3 no disponibles' },
    { titulo: 'Pedidos de hoy', valor: '18', icono: 'bi-receipt', detalle: '+4 respecto a ayer' },
    { titulo: 'Clientes', valor: '132', icono: 'bi-people', detalle: '9 nuevos esta semana' },
    { titulo: 'Ventas de hoy', valor: 'S/ 486.50', icono: 'bi-cash-stack', detalle: 'Ticket promedio S/ 27.03' }
  ];

  masVendidos = [
    { nombre: 'Cappuccino', ventas: 42 },
    { nombre: 'Latte', ventas: 35 },
    { nombre: 'Cheesecake', ventas: 21 },
    { nombre: 'Croissant', ventas: 17 }
  ];

  ngOnInit() {
    this.cargarPedidosRecientes();
  }

  cargarPedidosRecientes() {
    this.pedidoService.obtenerUltimosPedidosAdmin().subscribe({
      next: (datos) => {
        this.ultimosPedidos = datos;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando pedidos del admin:', err);
      }
    });
  }

  get maxVentas(): number {
    return Math.max(...this.masVendidos.map(p => p.ventas));
  }

  claseEstado(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'EN PREPARACION': return 'estado-preparacion';
      case 'COMPLETADO':
      case 'ENTREGADO': return 'estado-entregado';
      default: return 'estado-cancelado';
    }
  }
}
