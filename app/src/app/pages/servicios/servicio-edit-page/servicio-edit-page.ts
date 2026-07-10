import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { ServicioService } from '../../../core/services/servicio';
import { CategoriaService } from '../../../core/services/categoria';
import { ProfesionalService } from '../../../core/services/profesional';
import { EspecialidadService } from '../../../core/services/especialidad';
import { Categoria } from '../../../core/models/categoria.model';
import { Profesional } from '../../../core/models/profesional.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import {
  Servicio,
  ServicioCreateDto,
  ServicioUpdateDto,
} from '../../../core/models/servicio.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-servicio-edit-page',
  standalone: true,
  imports: [ServicioForm, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './servicio-edit-page.html',
  styleUrl: './servicio-edit-page.css',
})
export class ServicioEditPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly notification = inject(NotificationService);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  servicio = signal<Servicio | null>(null);
  categorias = signal<Categoria[]>([]);
  profesionales = signal<Profesional[]>([]);
  especialidades = signal<Especialidad[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.cargarDatosFormulario();
  }

  cargarDatosFormulario(): void {
    if (!this.id) {
      this.error.set('El identificador del servicio no es válido');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      servicio: this.servicioService.obtenerPorId(this.id),
      categorias: this.categoriaService.listar(),
      profesionales: this.profesionalService.listar(),
      especialidades: this.especialidadService.listar(),
    }).subscribe({
      next: ({ servicio, categorias, profesionales, especialidades }) => {
        this.servicio.set(servicio.data);
        this.categorias.set(categorias.data ?? []);
        this.profesionales.set(profesionales ?? []);
        this.especialidades.set(especialidades.data ?? []);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del servicio');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(data: ServicioCreateDto | ServicioUpdateDto): void {
    if (!this.id) return;

    this.saving.set(true);

    this.servicioService.actualizar(this.id, data as ServicioUpdateDto).subscribe({
      next: (response) => {
        this.notification.success(response.message ?? 'Servicio actualizado correctamente');
        this.router.navigate(['/admin/servicios']);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/servicios']);
  }
}
