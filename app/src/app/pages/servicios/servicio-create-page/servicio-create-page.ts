import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
import { ServicioCreateDto, ServicioUpdateDto } from '../../../core/models/servicio.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-servicio-create-page',
  standalone: true,
  imports: [ServicioForm, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './servicio-create-page.html',
  styleUrl: './servicio-create-page.css',
})
export class ServicioCreatePage {
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly notification = inject(NotificationService);

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
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      categorias: this.categoriaService.listar(),
      profesionales: this.profesionalService.listar(),
      especialidades: this.especialidadService.listar(),
    }).subscribe({
      next: ({ categorias, profesionales, especialidades }) => {
        this.categorias.set(categorias.data ?? []);
        this.profesionales.set(profesionales ?? []);
        this.especialidades.set(especialidades.data ?? []);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos del formulario');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(data: ServicioCreateDto | ServicioUpdateDto): void {
    this.saving.set(true);

    this.servicioService.crear(data as ServicioCreateDto).subscribe({
      next: (response) => {
        this.notification.success(response.message ?? 'Servicio creado correctamente');
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
