import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../../../core/services/carrito';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class PedidoComponent {
  // Hacemos el servicio público para leerlo desde el HTML
  public carritoService = inject(CarritoService);
  private router = inject(Router);

  procesarPedido() {
    // Aquí es donde en el futuro haremos el POST a tu API de Node/PostgreSQL
    console.log('Enviando datos a la base de datos...');
    
    alert('¡Tu pedido ha sido procesado con éxito! Pronto lo conectaremos a la base de datos.');
    
    // Vaciamos el carrito tras la compra y redirigimos al inicio
    this.carritoService.vaciar();
    this.router.navigate(['/inicio']);
  }
}