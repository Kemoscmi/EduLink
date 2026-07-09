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

import { EspecialidadService } from '../../../core/services/especialidad';
import { Especialidad } from '../../../core/models/especialidad.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

type EstadoFiltro = 'ACTIVO' | 'INACTIVO' | null;

@Component({
  selector: 'app-especialidades-list',
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
  templateUrl: './especialidades-list.html',
  styleUrl: './especialidades-list.css',
})
export class EspecialidadesList {
  private readonly especialidadService = inject(EspecialidadService);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  especialidades = signal<Especialidad[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  updatingId = signal<number | null>(null);

  search = signal('');
  estadoFilter = signal<EstadoFiltro>(null);

  columnas = ['nombre', 'descripcion', 'activo', 'acciones'];

  especialidadesFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const estado = this.estadoFilter();

    return this.especialidades().filter((especialidad) => {
      const nombre = especialidad.nombre?.toLowerCase() ?? '';

      const coincideTexto = texto.length === 0 || nombre.includes(texto);

      const coincideEstado =
        estado === null ||
        (estado === 'ACTIVO' && especialidad.activo) ||
        (estado === 'INACTIVO' && !especialidad.activo);

      return coincideTexto && coincideEstado;
    });
  });

  totalEspecialidades = computed(() => this.especialidadesFiltradas().length);

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades(): void {
    this.loading.set(true);
    this.error.set(null);

    this.especialidadService.listar().subscribe({
      next: (response) => {
        this.especialidades.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades.');
        this.loading.set(false);
      },
    });
  }

  cambiarEstado(especialidad: Especialidad): void {
    const accion = especialidad.activo ? 'desactivar' : 'activar';

    this.confirmDialog
      .confirm({
        title: especialidad.activo ? 'Desactivar especialidad' : 'Activar especialidad',
        message: `¿Desea ${accion} la especialidad "${especialidad.nombre}"?`,
        icon: 'workspace_premium',
        confirmLabel: especialidad.activo ? 'Desactivar' : 'Activar',
        danger: especialidad.activo,
      })
      .subscribe((confirmado) => {
        if (!confirmado) return;

        this.updatingId.set(especialidad.id);

        this.especialidadService.cambiarEstado(especialidad.id).subscribe({
          next: (response) => {
            this.especialidades.update((lista) =>
              lista.map((item) => (item.id === especialidad.id ? response.data : item))
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

  clearFilters(): void {
    this.search.set('');
    this.estadoFilter.set(null);
  }
}
