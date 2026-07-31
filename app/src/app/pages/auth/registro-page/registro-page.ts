import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormField,
  form,
  required,
  minLength,
  maxLength,
  email as emailValidator,
} from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { NotificationService } from '../../../core/services/notification.service';

interface RegistroModel {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
}

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [
    FormField,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './registro-page.html',
  styleUrl: './registro-page.css',
})
export class RegistroPage {
  private readonly authService = inject(AuthenticationService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  submitting = signal(false);
  registroError = signal<string | null>(null);

  registroModel = signal<RegistroModel>({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
  });

  registroForm = form(this.registroModel, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio' });
    minLength(path.nombre, 2, { message: 'Mínimo 2 caracteres' });
    maxLength(path.nombre, 120, { message: 'Máximo 120 caracteres' });

    required(path.apellidos, { message: 'Los apellidos son obligatorios' });
    minLength(path.apellidos, 2, { message: 'Mínimo 2 caracteres' });
    maxLength(path.apellidos, 170, { message: 'Máximo 170 caracteres' });

    required(path.email, { message: 'El correo es obligatorio' });
    emailValidator(path.email, { message: 'Ingrese un correo válido' });

    required(path.password, { message: 'La contraseña es obligatoria' });
    minLength(path.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres' });

    required(path.telefono, { message: 'El teléfono es obligatorio' });
    minLength(path.telefono, 8, { message: 'El teléfono debe tener al menos 8 caracteres' });
    maxLength(path.telefono, 20, { message: 'Máximo 20 caracteres' });
  });

  private camposDelFormulario() {
    return [
      this.registroForm.nombre(),
      this.registroForm.apellidos(),
      this.registroForm.email(),
      this.registroForm.password(),
      this.registroForm.telefono(),
    ];
  }

  submit(): void {
    if (this.submitting()) return;

    this.registroError.set(null);
    this.camposDelFormulario().forEach((campo) => campo.markAsTouched());

    if (this.camposDelFormulario().some((campo) => campo.invalid())) {
      return;
    }

    this.submitting.set(true);

    this.authService.registrar(this.registroModel()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notification.success('Registro exitoso. Ahora puede iniciar sesión.');
        this.router.navigateByUrl('/login');
      },
      error: (error: Error) => {
        this.submitting.set(false);
        this.registroError.set(error.message);
      },
    });
  }
}
