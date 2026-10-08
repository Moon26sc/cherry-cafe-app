import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <- CRUCIAL PARA LA NAVEGACIÓN

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule], // <- INYECTAR AQUÍ
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent { }