import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto, ItemCarrito } from '../../shared/models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // El estado interno privado del carrito
  private items: ItemCarrito[] = [];

  // BehaviorSubjects: Actúan como "emisoras de radio" que transmiten los datos en tiempo real
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private totalPrecioSubject = new BehaviorSubject<number>(0);

  // Observables públicos para que los componentes se suscriban (escuchen)
  carrito$ = this.carritoSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();
  totalPrecio$ = this.totalPrecioSubject.asObservable();

  constructor() { }

  agregar(producto: Producto) {
    // Busca si el producto ya está en el carrito
    const itemExistente = this.items.find(item => item.producto.nombre === producto.nombre);

    if (itemExistente) {
      itemExistente.cantidad++; // Si existe, suma 1 a la cantidad
    } else {
      this.items.push({ producto, cantidad: 1 }); // Si no, lo agrega como nuevo
    }
    
    this.actualizarEstado();
  }

  eliminar(productoNombre: string) {
    this.items = this.items.filter(item => item.producto.nombre !== productoNombre);
    this.actualizarEstado();
  }

  vaciar() {
    this.items = [];
    this.actualizarEstado();
  }

  // Recalcula los totales y emite la nueva información a toda la app
  private actualizarEstado() {
    this.carritoSubject.next([...this.items]);
    this.totalItemsSubject.next(this.items.reduce((total, item) => total + item.cantidad, 0));
    this.totalPrecioSubject.next(this.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0));
  }
}