import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../../core/services/pedido'; 

@Component({
  selector: 'app-pedidos-entrantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-entrantes.html'
})
export class PedidosEntrantesComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: any[] = [];
  cargando: boolean = true;

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidoService.obtenerTodosLosPedidosAdmin().subscribe({
      next: (datos) => {
        this.pedidos = datos;
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarEstado(pedido: any, event: Event) {
    const nuevoEstado = (event.target as HTMLSelectElement).value;
    const idDelPedido = pedido.id_pedido;

    this.pedidoService.actualizarEstado(idDelPedido, nuevoEstado).subscribe({
      next: () => {
        pedido.estado = nuevoEstado;
        this.cdr.detectChanges(); 
      },
      error: (err) => alert('Error al actualizar: ' + err.error.mensaje)
    });
  }

  claseEstado(estado: string): string {
    if (!estado) return '';
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'bg-warning text-dark border-warning';
      case 'EN PREPARACION': return 'bg-primary text-white border-primary';
      case 'ENTREGADO': return 'bg-success text-white border-success';
      case 'CANCELADO': return 'bg-danger text-white border-danger';
      default: return 'bg-light';
    }
  }
}