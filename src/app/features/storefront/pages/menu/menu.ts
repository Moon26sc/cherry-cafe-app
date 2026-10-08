import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Producto } from '../../../../shared/models/producto';
import { CarritoService } from '../../../../core/services/carrito';
import { ProductoService } from '../../../../core/services/producto'; 

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  private carritoService = inject(CarritoService);
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);

  categoriaActual: string = 'todas';
  terminoBusqueda: string = '';
  productoSeleccionado: Producto | null = null;

  productos: Producto[] = []; 
  productosFiltrados: Producto[] = [];

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (datosDesdePostgreSQL) => {
        this.productos = datosDesdePostgreSQL;
        this.productosFiltrados = [...this.productos];
        this.cdr.detectChanges(); 
      },
      error: (error) => console.error('Error al conectar con la API PHP:', error)
    });
  }

  establecerCategoria(categoria: string) {
    this.categoriaActual = categoria;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let filtrados = this.productos;
    if (this.categoriaActual !== 'todas') {
      filtrados = filtrados.filter(p => p.categoria === this.categoriaActual);
    }
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase();
      filtrados = filtrados.filter(p => 
        p.nombre.toLowerCase().includes(termino) || p.descripcion.toLowerCase().includes(termino)
      );
    }
    this.productosFiltrados = filtrados;
  }

  abrirDetalles(producto: Producto) {
    this.productoSeleccionado = producto;
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }
}




