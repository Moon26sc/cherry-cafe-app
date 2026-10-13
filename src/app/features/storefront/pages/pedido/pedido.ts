import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CarritoService } from '../../../../core/services/carrito';
import { PedidoService } from '../../../../core/services/pedido';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class PedidoComponent implements OnInit {
  public carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  itemsCarrito: any[] = [];
  total: number = 0;
  usuarioActual: any = null;

  datosFormulario = {
    nombre: '',
    telefono: '',
    direccion: '',
    metodoPago: 'YAPE' 
  };

  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => this.itemsCarrito = items);
    this.carritoService.totalPrecio$.subscribe(total => this.total = total);
    
    this.authService.currentUser$.subscribe(user => {
      this.usuarioActual = user;
      if (user) {
        this.datosFormulario.nombre = user.nombre;
      }
    });
  }

  procesarPedido() {
    if (this.itemsCarrito.length === 0) return;

    const datosPedido = {
      id_cliente: this.usuarioActual ? this.usuarioActual.id_usuario : null,
      total: this.total,
      tipo_entrega: 'DELIVERY', 
      metodo_pago: this.datosFormulario.metodoPago,
      items: this.itemsCarrito.map(item => ({
        id_producto: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio
      }))
    };

    this.pedidoService.procesarPedido(datosPedido).subscribe({
      next: (respuesta) => {
        alert(`¡Gracias por tu compra, ${this.datosFormulario.nombre.split(' ')[0]}! Tu número de pedido es: #${respuesta.id_pedido}`);
        this.carritoService.vaciar(); 
        this.router.navigate(['/inicio']); 
      },
      error: (err) => {
        alert('Hubo un problema al procesar el pago: ' + err.error.mensaje);
      }
    });
  }
}