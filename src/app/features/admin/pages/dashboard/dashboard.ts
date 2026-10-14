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
  resumen: any[] = []; 
  masVendidos: any[] = [];
  
  ngOnInit() {
    this.cargarPedidosRecientes();
    this.cargarResumen();
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

  cargarResumen() {
    this.pedidoService.obtenerResumenDashboard().subscribe({
      next: (datos) => {
        this.resumen = [
          { titulo: 'Productos', valor: datos.productos, icono: 'bi-box-seam', detalle: 'Catálogo activo' },
          { titulo: 'Pedidos de hoy', valor: datos.pedidos_hoy, icono: 'bi-receipt', detalle: 'Actualizado' },
          { titulo: 'Clientes', valor: datos.clientes, icono: 'bi-people', detalle: 'Usuarios registrados' },
          { titulo: 'Ventas de hoy', valor: `S/ ${parseFloat(datos.ventas_hoy).toFixed(2)}`, icono: 'bi-cash-stack', detalle: 'No incluye cancelados' }
        ];

        this.masVendidos = datos.mas_vendidos.map((item: any) => ({
          nombre: item.nombre,
          ventas: Number(item.ventas) 
        }));
        
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al cargar el resumen', err)
    });
  }

  cambiarEstado(pedido: any, event: Event) {
    const nuevoEstado = (event.target as HTMLSelectElement).value;
    const idDelPedido = pedido.id || pedido.id_pedido;

    this.pedidoService.actualizarEstado(idDelPedido, nuevoEstado).subscribe({
      next: (respuesta) => {
        pedido.estado = nuevoEstado;
        console.log(`Pedido #${idDelPedido} actualizado a ${nuevoEstado}`);
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Hubo un error al actualizar el estado: ' + err.error.mensaje);
      }
    });
  }

  get maxVentas(): number {
    return Math.max(...this.masVendidos.map(p => p.ventas));
  }

  claseEstado(estado: string): string {
    if (!estado) return '';

    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'EN PREPARACION': return 'estado-preparacion';
      case 'ENTREGADO': return 'estado-entregado';
      case 'CANCELADO': return 'estado-cancelado';
      default: return '';
    }
  }



}
