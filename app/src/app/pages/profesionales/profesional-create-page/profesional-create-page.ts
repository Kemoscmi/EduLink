import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';
import { ProfesionalService } from '../../../core/services/profesional';
import { NotificationService } from '../../../core/services/notification.service';
import { EspecialidadService } from '../../../core/services/especialidad';
import { Especialidad } from '../../../core/models/especialidad.model';

@Component({
  selector: 'app-profesional-create-page',
  standalone: true,
  imports: [
    ProfesionalForm,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './profesional-create-page.html',
  styleUrl: './profesional-create-page.css',
})
export class ProfesionalCreatePage {
  private readonly router = inject(Router);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly notification = inject(NotificationService);

  especialidades = signal<Especialidad[]>([]);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.cargarEspecialidades();
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

  guardar(data: any): void {
    this.saving.set(true);
    this.error.set(null);

    this.profesionalService.crear(data).subscribe({
      next: (response: any) => {
        this.notification.success(response.message ?? 'Profesional registrado correctamente');
        this.router.navigate(['/admin/profesionales']);
      },
      error: (err: any) => {
        console.error('Error al registrar profesional:', err);
        const errorMsg = err.error?.message || 'Ocurrió un error al registrar al profesional.';
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
