import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './reservas.html'
})
export class ReservasComponent {
  reserva = { nombre: '', correo: '', fecha: '', personas: 2, comentario: '' };
  enviado = false;

  registrar(): void {
    this.enviado = true;
  }

  nuevaReserva(): void {
    this.reserva = { nombre: '', correo: '', fecha: '', personas: 2, comentario: '' };
    this.enviado = false;
  }
}