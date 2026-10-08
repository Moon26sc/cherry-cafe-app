import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService); 

  registroForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  passwordsNoCoinciden: boolean = false;

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const datosUsuario = this.registroForm.value;

    if (datosUsuario.password !== datosUsuario.confirmPassword) {
      this.passwordsNoCoinciden = true;
      return;
    }
    this.passwordsNoCoinciden = false;

    this.authService.registrar(datosUsuario).subscribe({
      next: (respuesta) => {
        alert(respuesta.mensaje);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert(err.error.mensaje || 'Ocurrió un error en el servidor');
      }
    });
  }
}