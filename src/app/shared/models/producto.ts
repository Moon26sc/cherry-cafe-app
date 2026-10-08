// src/app/shared/models/producto.ts
export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  disponible: boolean;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}