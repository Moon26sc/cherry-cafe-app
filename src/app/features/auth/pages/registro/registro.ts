import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Formulario con los datos básicos que pedirá PostgreSQL
  registroForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  // Bandera para mostrar error visual si las contraseñas no cuadran
  passwordsNoCoinciden: boolean = false;

  registrar() {
    // 1. Validar que no haya campos vacíos
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    // 2. Extraer los datos
    const datosUsuario = this.registroForm.value;

    // 3. Validar coincidencia de contraseñas
    if (datosUsuario.password !== datosUsuario.confirmPassword) {
      this.passwordsNoCoinciden = true;
      return;
    }

    this.passwordsNoCoinciden = false;

    // 4. SIMULACIÓN DE REGISTRO
    // Aquí tu backend encriptará la contraseña (ej. con bcrypt en Node/PHP) y hará el INSERT
    console.log('Enviando nuevo usuario a PostgreSQL:', datosUsuario);
    alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión en Cherry Café.');

    // 5. Redirigir al login tras un registro exitoso
    this.router.navigate(['/auth/login']);
  }
}