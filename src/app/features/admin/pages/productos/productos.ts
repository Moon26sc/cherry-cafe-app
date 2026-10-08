import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../../shared/models/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importamos los formularios reactivos
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  // Formulario reactivo para crear/editar
  productoForm: FormGroup;
  modoEdicion: boolean = false;
  productoSeleccionadoId?: number;

  // Lista simulada (Eventualmente vendrá de un GET a tu API)
  productos: Producto[] = [
    { id: 1, nombre: 'Espresso Cherry', descripcion: 'Espresso puro peruano.', precio: 9.90, imagen: 'assets/img/cherrycafe.jpeg', categoria: 'Cafés', disponible: true },
    { id: 2, nombre: 'Cappuccino Terciopelo', descripcion: 'Espresso con espuma sedosa.', precio: 12.90, imagen: 'assets/img/capuchino.jpeg', categoria: 'Cafés', disponible: true },
    { id: 3, nombre: 'Cheesecake Espresso', descripcion: 'Base de galleta y queso.', precio: 15.90, imagen: 'assets/img/Cheesecake.jpg', categoria: 'Postres', disponible: false }
  ];

  constructor() {
    // Definimos las reglas de validación (NOT NULL de tu base de datos)
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.1)]],
      categoria: ['', Validators.required],
      imagen: ['assets/img/placeholder.jpg', Validators.required],
      disponible: [true]
    });
  }

  ngOnInit() {}

  // === OPERACIONES CRUD SIMULADAS ===

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.productoForm.reset({ precio: 0, imagen: 'assets/img/placeholder.jpg', disponible: true });
  }

  abrirModalEditar(producto: Producto) {
    this.modoEdicion = true;
    this.productoSeleccionadoId = producto.id;
    // Llenamos el formulario con los datos actuales
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      imagen: producto.imagen,
      disponible: producto.disponible
    });
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const datosFormulario = this.productoForm.value;

    if (this.modoEdicion) {
      // Simula un UPDATE en PostgreSQL
      const index = this.productos.findIndex(p => p.id === this.productoSeleccionadoId);
      if (index !== -1) {
        this.productos[index] = { id: this.productoSeleccionadoId, ...datosFormulario };
        console.log('Producto actualizado:', this.productos[index]);
      }
    } else {
      // Simula un INSERT en PostgreSQL
      const nuevoProducto: Producto = {
        id: Math.floor(Math.random() * 1000) + 10, // Generamos un ID temporal
        ...datosFormulario
      };
      this.productos.unshift(nuevoProducto); // Lo ponemos al inicio de la tabla
      console.log('Nuevo producto guardado:', nuevoProducto);
    }

    // Cerramos el modal programáticamente usando Vanilla JS (Bootstrap behavior)
    document.getElementById('cerrarModalBtn')?.click();
  }

  eliminarProducto(id?: number) {
    if (confirm('¿Estás seguro de eliminar este producto de la base de datos?')) {
      // Simula un DELETE en PostgreSQL
      this.productos = this.productos.filter(p => p.id !== id);
      console.log(`Producto con ID ${id} eliminado.`);
    }
  }
}