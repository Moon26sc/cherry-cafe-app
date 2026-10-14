import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito'; 
import { AuthService } from '../../../core/services/auth';     

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent implements OnInit {
  public carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  private cdr = inject(ChangeDetectorRef); 

  usuarioActual: any = null;
  menuAbierto: boolean = false; 

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.usuarioActual = user;
      
      this.cdr.detectChanges(); 
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    this.menuAbierto = false;
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }
}