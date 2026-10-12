import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { CarritoService } from '../../../../core/services/carrito';
import { ItemCarrito } from '../../../../shared/models/producto';

// Datos que el cliente llena en el formulario
interface DatosEntrega {
  nombre: string;
  telefono: string;
  direccion: string;
  notas: string;
  metodoPago: 'yape' | 'efectivo';
}

// Lo que se muestra en la pantalla de confirmación
interface PedidoConfirmado {
  numero: number;
  fecha: Date;
  datos: DatosEntrega;
  items: ItemCarrito[];
  total: number;
}

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class PedidoComponent {
  // Hacemos el servicio público para leerlo desde el HTML
  public carritoService = inject(CarritoService);

  // Cada campo del formulario está conectado a esta variable con [(ngModel)]
  datos: DatosEntrega = {
    nombre: '',
    telefono: '',
    direccion: '',
    notas: '',
    metodoPago: 'yape'
  };

  // Cuando tiene valor, el HTML muestra la pantalla de confirmación en vez del formulario
  pedidoConfirmado: PedidoConfirmado | null = null;

  procesarPedido(formulario: NgForm) {
    // Si falta algún dato, marcamos todos los campos para que se vean los mensajes de error
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    // Copiamos el carrito ANTES de vaciarlo, para poder mostrarlo en la confirmación
    this.carritoService.carrito$.pipe(take(1)).subscribe(items => {
      if (items.length === 0) return;

      const total = items.reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0);

      // TODO: cuando esté la base de datos, enviar el pedido a la API PHP con un POST
      // y usar el número de pedido que devuelva el servidor.
      this.pedidoConfirmado = {
        numero: Math.floor(1000 + Math.random() * 9000),
        fecha: new Date(),
        datos: { ...this.datos },
        items: [...items],
        total
      };

      this.carritoService.vaciar();
      window.scrollTo({ top: 0 });
    });
  }
}
