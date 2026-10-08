import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../../shared/models/producto';
import { ProductoService } from '../../../../core/services/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService); 
  private cdr = inject(ChangeDetectorRef);
  
  productoForm: FormGroup;
  modoEdicion: boolean = false;
  productoSeleccionadoId?: number;
  productos: Producto[] = []; 

  constructor() {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.1)]],
      categoria: ['', Validators.required], 
      imagen: ['assets/img/placeholder.jpg', Validators.required],
      disponible: [true]
    });
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al cargar', err)
    });
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.productoForm.reset({ precio: 0, imagen: 'assets/img/placeholder.jpg', disponible: true, categoria: 'Cafés' });
  }

  abrirModalEditar(producto: Producto) {
    this.modoEdicion = true;
    this.productoSeleccionadoId = producto.id;
    this.productoForm.patchValue(producto);
  }

  guardarProducto() {
    if (this.productoForm.invalid) return;

    const datosFormulario = this.productoForm.value;

    if (this.modoEdicion && this.productoSeleccionadoId) {
      this.productoService.actualizarProducto(this.productoSeleccionadoId, datosFormulario).subscribe({
        next: () => {
          this.cargarProductos(); 
          document.getElementById('cerrarModalBtn')?.click();
        }
      });
    } else {
      this.productoService.crearProducto(datosFormulario).subscribe({
        next: () => {
          this.cargarProductos(); 
          document.getElementById('cerrarModalBtn')?.click();
        }
      });
    }
  }

  eliminarProducto(id?: number) {
    if (id && confirm('¿Estás seguro de eliminar permanentemente este producto de la base de datos?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => this.cargarProductos(), 
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

 toggleDisponibilidad(producto: Producto) {
    if (!producto.id) {
      console.error('El producto no tiene un ID válido.');
      return;
    }

    const nuevoEstado = !producto.disponible;
    
    this.productoService.actualizarParcialProducto(producto.id, { disponible: nuevoEstado }).subscribe({
      next: () => {
        producto.disponible = nuevoEstado; 
      },
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }
}


