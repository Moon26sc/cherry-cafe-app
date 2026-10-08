import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Producto } from '../../../../shared/models/producto'; // Importamos la interfaz central
import { CarritoService } from '../../../../core/services/carrito'; // Importamos el servicio

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  // Inyección del servicio
  private carritoService = inject(CarritoService);

  categoriaActual: string = 'todas';
  terminoBusqueda: string = '';
  productoSeleccionado: Producto | null = null;

  // Tu arreglo maestro de productos (Mismo de antes)
  productos: Producto[] = [
    { nombre: 'Espresso Cherry', descripcion: 'Espresso puro de origen peruano, cuerpo intenso y aroma profundo.', precio: 9.90, imagen: 'assets/img/cherrycafe.jpeg', categoria: 'Cafés', disponible: true },
    { nombre: 'Cappuccino Terciopelo', descripcion: 'Espresso con leche vaporizada y una espuma suave y sedosa.', precio: 12.90, imagen: 'assets/img/capuchino.jpeg', categoria: 'Cafés', disponible: true },
    { nombre: 'Latte Caramel', descripcion: 'Espresso, leche cremosa y un toque de caramelo artesanal.', precio: 13.90, imagen: 'assets/img/latee.jpeg', categoria: 'Cafés', disponible: true },
    { nombre: 'Chocolate Espresso', descripcion: 'Chocolate artesanal con un toque de espresso y canela.', precio: 13.50, imagen: 'assets/img/expreso.jpeg', categoria: 'Bebidas calientes', disponible: true },
    { nombre: 'Infusión Vainilla', descripcion: 'Té de hierbas con notas suaves de vainilla y miel.', precio: 10.50, imagen: 'assets/img/infucion.jpeg', categoria: 'Bebidas calientes', disponible: true },
    { nombre: 'Chai Latte', descripcion: 'Especias cálidas, leche vaporizada y un toque de miel.', precio: 12.50, imagen: 'assets/img/chailate.jpeg', categoria: 'Bebidas calientes', disponible: false },
    { nombre: 'Cold Brew Cherry', descripcion: 'Café de extracción en frío durante 18 horas, suave y aromático.', precio: 14.90, imagen: 'assets/img/cold.jpeg', categoria: 'Bebidas frías', disponible: true },
    { nombre: 'Frappé Caramel', descripcion: 'Café helado batido con un toque de caramelo artesanal.', precio: 16.90, imagen: 'assets/img/frapecaramel.jpeg', categoria: 'Bebidas frías', disponible: true },
    { nombre: 'Té Helado Cherry', descripcion: 'Infusión frutal servida bien fría, ligera y refrescante.', precio: 11.90, imagen: 'assets/img/techerry.jpeg', categoria: 'Bebidas frías', disponible: true },
    { nombre: 'Cheesecake Espresso', descripcion: 'Base de galleta, queso cremoso y un toque de café.', precio: 15.90, imagen: 'assets/img/Cheesecake.jpg', categoria: 'Postres', disponible: true },
    { nombre: 'Alfajor Boho', descripcion: 'Alfajor artesanal relleno de manjar y cubierto de coco.', precio: 7.90, imagen: 'assets/img/alfajor.jpeg', categoria: 'Postres', disponible: true },
    { nombre: 'Brownie Cherry', descripcion: 'Brownie de chocolate intenso con nuez, servido tibio.', precio: 10.90, imagen: 'assets/img/browni.jpeg', categoria: 'Postres', disponible: true },
    { nombre: 'Croissant Artesanal', descripcion: 'Hojaldrado y horneado a diario en casa.', precio: 8.90, imagen: 'assets/img/crosant.jpeg', categoria: 'Acompañamientos', disponible: true },
    { nombre: 'Tostada Almendra', descripcion: 'Pan artesanal con crema de almendra y miel.', precio: 11.90, imagen: 'assets/img/tostada.jpeg', categoria: 'Acompañamientos', disponible: true },
    { nombre: 'Bagel Integral', descripcion: 'Bagel integral con queso crema y hierbas frescas.', precio: 12.90, imagen: 'assets/img/bagel.jpg', categoria: 'Acompañamientos', disponible: true }
  ];

  productosFiltrados: Producto[] = [];

  ngOnInit() {
    this.productosFiltrados = [...this.productos];
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

  // === NUEVO: Función que llama al servicio ===
  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }
}