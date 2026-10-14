import { Component } from '@angular/core';
import { DatePipe, UpperCasePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EVENTOS } from '../../../../shared/data/datos-eventos';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [DatePipe, UpperCasePipe, CurrencyPipe, RouterLink],
  templateUrl: './eventos.html'
})
export class EventosComponent {
  eventos = EVENTOS;
}