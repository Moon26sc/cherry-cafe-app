import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent {
  // Los valores se recorren con *ngFor en el HTML para no repetir el mismo bloque 3 veces
  valores = [
    {
      icono: 'bi-award',
      titulo: 'Calidad',
      texto: 'Seleccionamos granos de especialidad y los preparamos con cuidado en cada taza.'
    },
    {
      icono: 'bi-geo-alt',
      titulo: 'Origen',
      texto: 'Trabajamos con productores locales y apostamos por un café de comercio justo.'
    },
    {
      icono: 'bi-heart',
      titulo: 'Calidez',
      texto: 'Queremos que te sientas en casa: un lugar para conversar, leer o simplemente pausar.'
    }
  ];
}
