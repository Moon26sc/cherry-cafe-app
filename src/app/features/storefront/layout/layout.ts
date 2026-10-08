import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <- CRUCIAL PARA LA NAVEGACIÓN

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule], // <- INYECTAR AQUÍ
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent { }