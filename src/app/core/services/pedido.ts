import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/pedidos.php';

  procesarPedido(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl, pedido);
  }

  obtenerMisPedidos(idCliente: number): Observable<any> {
    return this.http.get(`http://localhost:8000/api/mis_pedidos.php?id_cliente=${idCliente}`);
  }

  obtenerUltimosPedidosAdmin(): Observable<any> {
    return this.http.get('http://localhost:8000/api/pedidos_admin.php');
  }

  actualizarEstado(idPedido: number, nuevoEstado: string): Observable<any> {
    const payload = {
      id_pedido: idPedido,
      estado: nuevoEstado
    };
    return this.http.post('http://localhost:8000/api/actualizar_estado.php', payload);
  }

  obtenerResumenDashboard(): Observable<any> {
    return this.http.get('http://localhost:8000/api/resumen_dashboard.php');
  }

  obtenerTodosLosPedidosAdmin(): Observable<any> {
    return this.http.get('http://localhost:8000/api/pedidos_entrantes.php');
  }

}