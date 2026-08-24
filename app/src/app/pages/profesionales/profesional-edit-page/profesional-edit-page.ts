import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';
import { ProfesionalService } from '../../../core/services/profesional';
import { Profesional } from '../../../core/models/profesional.model';
import { NotificationService } from '../../../core/services/notification.service';
import { EspecialidadService } from '../../../core/services/especialidad';
import { Especialidad } from '../../../core/models/especialidad.model';

@Component({
  selector: 'app-profesional-edit-page',
  standalone: true,
  imports: [
    ProfesionalForm,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './profesional-edit-page.html',
  styleUrl: './profesional-edit-page.css',
})
export class ProfesionalEditPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly notification = inject(NotificationService);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  profesional = signal<Profesional | null>(null);
  especialidades = signal<Especialidad[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.cargarEspecialidades();
    this.cargarProfesional();
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (res) => {
        this.especialidades.set((res.data ?? []).filter(e => e.activo));
      },
      error: (err) => {
        console.error('Error al cargar especialidades:', err);
      }
    });
  }

  cargarProfesional(): void {
    if (!this.id) {
      this.error.set('El identificador del profesional no es válido');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.profesionalService.obtenerPorId(this.id).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.profesional.set(res.data);
        } else {
          this.error.set('No se pudo encontrar al profesional.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar profesional para edición:', err);
        this.error.set('Error al conectar con el servidor.');
        this.loading.set(false);
      }
    });
  }

  guardar(data: any): void {
    if (!this.id) return;

    this.saving.set(true);
    this.error.set(null);

    this.profesionalService.actualizar(this.id, data).subscribe({
      next: (response: any) => {
        this.notification.success(response.message ?? 'Profesional actualizado correctamente');
        this.router.navigate(['/admin/profesionales']);
      },
      error: (err: any) => {
        console.error('Error al actualizar profesional:', err);
        const errorMsg = err.error?.message || 'Ocurrió un error al actualizar al profesional.';
        this.notification.error(errorMsg);
        this.error.set(errorMsg);
        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/profesionales']);
  }
}
