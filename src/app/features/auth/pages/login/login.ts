import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Reglas estrictas: correo válido y contraseña de mínimo 6 caracteres
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  iniciarSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Muestra los errores en rojo si intentan enviar vacío
      return;
    }

    const { email, password } = this.loginForm.value;

    // SIMULACIÓN DE RUTEO POR ROLES
    // En el futuro, tu API devolverá un JWT con el rol del usuario
    if (email === 'admin@cherry.com' && password === '123456') {
      console.log('Login exitoso: Administrador');
      this.router.navigate(['/admin/dashboard']);
    } else {
      console.log('Login exitoso: Cliente');
      this.router.navigate(['/inicio']);
    }
  }
}