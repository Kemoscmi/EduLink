import { Component, effect, inject, signal } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Usuario } from '../../../core/models/usuario.model';

interface PerfilModel {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
}

const ROLE_LABELS: Record<Usuario['role'], string> = {
  ADMIN: 'Administrador',
  TUTOR: 'Profesional',
  USER: 'Cliente',
};

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './perfil-page.html',
  styleUrl: './perfil-page.css',
})
export class PerfilPage {
  private readonly authService = inject(AuthenticationService);
  private readonly notification = inject(NotificationService);

  usuario = this.authService.usuario;
  guardando = signal(false);
  perfilError = signal<string | null>(null);

  perfilModel = signal<PerfilModel>({ nombre: '', apellidos: '', email: '', telefono: '' });

  perfilForm = form(this.perfilModel, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio' });
    minLength(path.nombre, 2, { message: 'Mínimo 2 caracteres' });
    maxLength(path.nombre, 120, { message: 'Máximo 120 caracteres' });

    required(path.apellidos, { message: 'Los apellidos son obligatorios' });
    minLength(path.apellidos, 2, { message: 'Mínimo 2 caracteres' });
    maxLength(path.apellidos, 170, { message: 'Máximo 170 caracteres' });

    required(path.email, { message: 'El correo es obligatorio' });
    emailValidator(path.email, { message: 'Ingrese un correo válido' });

    required(path.telefono, { message: 'El teléfono es obligatorio' });
    minLength(path.telefono, 8, { message: 'El teléfono debe tener al menos 8 caracteres' });
    maxLength(path.telefono, 20, { message: 'Máximo 20 caracteres' });
  });

  constructor() {
    effect(() => {
      const usuario = this.usuario();
      if (!usuario) return;

      this.perfilModel.set({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        telefono: usuario.telefono ?? '',
      });
    });
  }

  roleLabel(role: Usuario['role']): string {
    return ROLE_LABELS[role];
  }

  private camposDelFormulario() {
    return [
      this.perfilForm.nombre(),
      this.perfilForm.apellidos(),
      this.perfilForm.email(),
      this.perfilForm.telefono(),
    ];
  }

  guardar(): void {
    if (this.guardando()) return;

    this.perfilError.set(null);
    this.camposDelFormulario().forEach((campo) => campo.markAsTouched());

    if (this.camposDelFormulario().some((campo) => campo.invalid())) {
      return;
    }

    this.guardando.set(true);

    this.authService.actualizarPerfil(this.perfilModel()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.notification.success('Perfil actualizado correctamente');
      },
      error: (error: Error) => {
        this.guardando.set(false);
        this.perfilError.set(error.message);
      },
    });
  }
}
