import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../../core/services/pedido';
import { AuthService } from '../../../../core/services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-pedidos.html'
})
export class MisPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef); 

  historialPedidos: any[] = [];
  cargando: boolean = true;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id_usuario) {
        this.cargarHistorial(user.id_usuario);
      } else {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarHistorial(idCliente: number) {
    this.pedidoService.obtenerMisPedidos(idCliente).subscribe({
      next: (datos) => {
        this.historialPedidos = datos;
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar historial', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}