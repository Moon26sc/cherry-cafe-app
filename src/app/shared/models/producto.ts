export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;       
  id_categoria?: number;   
  disponible: boolean;
  tamanio?: string;        
  tipo?: string;           
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}