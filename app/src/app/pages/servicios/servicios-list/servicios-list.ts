import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ServicioService } from '../../../core/services/servicio';
import { Servicio } from '../../../core/models/servicio.model';
import { Categoria } from '../../../core/models/categoria.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

type Modalidad = 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA';

@Component({
  selector: 'app-servicios-list',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css',
})
export class ServiciosList {
  private readonly servicioService = inject(ServicioService);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly router = inject(Router);

  isAdminMode = computed(() => this.router.url.includes('/admin'));

  servicios = signal<Servicio[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  updatingId = signal<number | null>(null);

  search = signal('');
  categoriaFilter = signal<number | null>(null);
  modalidadFilter = signal<Modalidad | null>(null);
  precioMin = signal<number | null>(null);
  precioMax = signal<number | null>(null);

  modalidades: Modalidad[] = ['VIRTUAL', 'PRESENCIAL', 'MIXTA'];

  categorias = computed<Categoria[]>(() => {
    const map = new Map<number, Categoria>();

    this.servicios().forEach((servicio) => {
      if (servicio.categoria) {
        map.set(servicio.categoria.id, servicio.categoria);
      }
    });

    return Array.from(map.values());
  });

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const categoriaId = this.categoriaFilter();
    const modalidad = this.modalidadFilter();
    const min = this.precioMin();
    const max = this.precioMax();

    return this.servicios().filter((servicio) => {
      const nombre = servicio.nombre?.toLowerCase() ?? '';
      const descripcion = servicio.descripcion?.toLowerCase() ?? '';
      const categoriaNombre = servicio.categoria?.nombre?.toLowerCase() ?? '';
      const precio = Number(servicio.precio);

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        categoriaNombre.includes(texto);

      const coincideCategoria = categoriaId === null || servicio.categoriaId === categoriaId;

      const coincideModalidad = modalidad === null || servicio.modalidad === modalidad;

      const coincidePrecioMin = min === null || precio >= min;
      const coincidePrecioMax = max === null || precio <= max;

      return (
        coincideTexto &&
        coincideCategoria &&
        coincideModalidad &&
        coincidePrecioMin &&
        coincidePrecioMax
      );
    });
  });

  totalServicios = computed(() => this.serviciosFiltrados().length);

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicioService.listar().subscribe({
      next: (response) => {
        this.servicios.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });
  }

  cambiarEstado(servicio: Servicio): void {
    const accion = servicio.activo ? 'desactivar' : 'activar';

    this.confirmDialog
      .confirm({
        title: servicio.activo ? 'Desactivar servicio' : 'Activar servicio',
        message: `¿Desea ${accion} el servicio "${servicio.nombre}"?`,
        icon: 'design_services',
        confirmLabel: servicio.activo ? 'Desactivar' : 'Activar',
        danger: servicio.activo,
      })
      .subscribe((confirmado) => {
        if (!confirmado) return;

        this.updatingId.set(servicio.id);

        this.servicioService.cambiarEstado(servicio.id).subscribe({
          next: (response) => {
            this.servicios.update((lista) =>
              lista.map((item) => (item.id === servicio.id ? response.data : item))
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

  nombreProfesional(servicio: Servicio): string {
    const usuario = servicio.tutor?.usuario;
    return usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Sin asignar';
  }

  clearFilters(): void {
    this.search.set('');
    this.categoriaFilter.set(null);
    this.modalidadFilter.set(null);
    this.precioMin.set(null);
    this.precioMax.set(null);
  }
}
