import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, form, required, email as emailValidator } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { NotificationService } from '../../../core/services/notification.service';

interface CredencialesModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
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
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly authService = inject(AuthenticationService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  submitting = signal(false);
  loginError = signal<string | null>(null);

  credencialesModel = signal<CredencialesModel>({ email: '', password: '' });

  credencialesForm = form(this.credencialesModel, (path) => {
    required(path.email, { message: 'El correo es obligatorio' });
    emailValidator(path.email, { message: 'Ingrese un correo válido' });

    required(path.password, { message: 'La contraseña es obligatoria' });
  });

  submit(): void {
    if (this.submitting()) return;

    this.loginError.set(null);
    this.credencialesForm.email().markAsTouched();
    this.credencialesForm.password().markAsTouched();

    if (this.credencialesForm.email().invalid() || this.credencialesForm.password().invalid()) {
      return;
    }

    this.submitting.set(true);

    this.authService.login(this.credencialesModel()).subscribe({
      next: (usuario) => {
        this.submitting.set(false);
        this.notification.success(`Bienvenido, ${usuario.nombre}`);
        this.router.navigateByUrl('/');
      },
      error: (error: Error) => {
        this.submitting.set(false);
        this.loginError.set(error.message);
      },
    });
  }
}
