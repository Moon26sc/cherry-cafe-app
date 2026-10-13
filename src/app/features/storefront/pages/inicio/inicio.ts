import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth'; 

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {
  private authService = inject(AuthService);
  
  usuarioActual: any = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.usuarioActual = user;
    });
  }
}