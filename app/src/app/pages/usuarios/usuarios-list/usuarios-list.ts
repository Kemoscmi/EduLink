import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsuarioService } from '../../../core/services/usuario';
import { Usuario } from '../../../core/models/usuario.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

interface RoleOption {
  value: Usuario['role'];
  label: string;
}

@Component({
  selector: 'app-usuarios-list',
  imports: [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList {
  private readonly usuarioService = inject(UsuarioService);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  usuarios = signal<Usuario[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  updatingId = signal<number | null>(null);

  search = signal('');
  roleFilter = signal<Usuario['role'] | null>(null);

  columnas = ['nombre', 'email', 'role', 'activo', 'acciones'];

  roles: RoleOption[] = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'TUTOR', label: 'Profesional' },
    { value: 'USER', label: 'Cliente' },
  ];

  usuariosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const rol = this.roleFilter();

    return this.usuarios().filter((usuario) => {
      const nombreCompleto = `${usuario.nombre ?? ''} ${usuario.apellidos ?? ''}`.toLowerCase();
      const email = usuario.email?.toLowerCase() ?? '';

      const coincideTexto =
        texto.length === 0 || nombreCompleto.includes(texto) || email.includes(texto);

      const coincideRol = rol === null || usuario.role === rol;

      return coincideTexto && coincideRol;
    });
  });

  totalUsuarios = computed(() => this.usuariosFiltrados().length);

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usuarioService.listar().subscribe({
      next: (response) => {
        this.usuarios.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los usuarios.');
        this.loading.set(false);
      },
    });
  }

  cambiarEstado(usuario: Usuario): void {
    const accion = usuario.activo ? 'desactivar' : 'activar';

    this.confirmDialog
      .confirm({
        title: usuario.activo ? 'Desactivar usuario' : 'Activar usuario',
        message: `¿Desea ${accion} al usuario ${usuario.nombre} ${usuario.apellidos}?`,
        icon: 'toggle_on',
        confirmLabel: usuario.activo ? 'Desactivar' : 'Activar',
        danger: usuario.activo,
      })
      .subscribe((confirmado) => {
        if (!confirmado) return;

        this.updatingId.set(usuario.id);

        this.usuarioService.cambiarEstado(usuario.id).subscribe({
          next: (response) => {
            this.usuarios.update((lista) =>
              lista.map((item) => (item.id === usuario.id ? response.data : item))
            );
            this.notification.success(response.message ?? 'Estado actualizado correctamente');
            this.updatingId.set(null);
          },
          error: () => {
            this.updatingId.set(null);
          },
        });
      });
  }

  roleLabel(role: Usuario['role']): string {
    return this.roles.find((item) => item.value === role)?.label ?? role;
  }

  clearFilters(): void {
    this.search.set('');
    this.roleFilter.set(null);
  }
}
