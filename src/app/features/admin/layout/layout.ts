import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuarioActual: any = null;

  ngOnInit() {
    const userData = localStorage.getItem('cherry_user');
    if (userData) {
      this.usuarioActual = JSON.parse(userData);
    }
  }

  cerrarSesion(event: Event) {
    event.preventDefault(); 

    if (this.authService.logout) {
      this.authService.logout();
    } else {
      localStorage.removeItem('cherry_user'); 
    }
    
    this.router.navigate(['/inicio']);
  }
}