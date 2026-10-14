import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. Importar FormsModule
import { UsuarioService } from '../../../../core/services/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  vistaActual: string = 'clientes';
  colaboradores: any[] = [];
  clientes: any[] = [];
  cargando: boolean = true;

  // --- NUEVAS VARIABLES PARA EL MODAL ---
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  formularioActual: any = {};

  ngOnInit() { this.cargarUsuarios(); }


  cargarUsuarios() {
    this.usuarioService.obtenerClientes().subscribe({
      next: (datos: any[]) => {
        // Dividimos la data usando el filter() de JavaScript
        this.colaboradores = datos.filter(u => u.rol !== 'CLIENTE');
        this.clientes = datos.filter(u => u.rol === 'CLIENTE');

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }

  // Función para calcular "cuánto tiempo están con nosotros"
  calcularAntiguedad(fechaISO: string): string {
    if (!fechaISO) return 'Desconocido';

    const fechaRegistro = new Date(fechaISO);
    const hoy = new Date();

    // Calculamos la diferencia en meses
    let meses = (hoy.getFullYear() - fechaRegistro.getFullYear()) * 12;
    meses -= fechaRegistro.getMonth();
    meses += hoy.getMonth();

    if (meses <= 0) return 'Nuevo (este mes)';
    if (meses === 1) return '1 mes';
    if (meses >= 12) {
      const anios = Math.floor(meses / 12);
      return anios === 1 ? '1 año' : `${anios} años`;
    }
    return `${meses} meses`;
  }

  colorRol(rol: string): string {
    if (!rol) return 'bg-secondary';
    switch (rol.toUpperCase()) {
      case 'ADMIN': return 'bg-danger text-white';
      case 'CAJERO': return 'bg-info text-dark';
      case 'BARISTA': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
    }
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    // Pre-configuramos el rol dependiendo de la pestaña actual
    this.formularioActual = { 
      rol: this.vistaActual === 'clientes' ? 'CLIENTE' : 'BARISTA',
      estado: 'ACTIVO' // Por defecto, todos nacen activos
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: any) {
    this.modoEdicion = true;
    this.formularioActual = { ...usuario }; // Copiamos los datos exactos de la fila
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.formularioActual = {};
  }

  guardarDatos() {
    this.usuarioService.guardarUsuario(this.formularioActual).subscribe({
      next: (respuesta) => {
        this.cerrarModal();
        this.cargarUsuarios(); // Recarga la tabla de PostgreSQL al instante
      },
      error: (err) => {
        alert('Hubo un error al guardar: ' + err.error.mensaje);
      }
    });
  }

}