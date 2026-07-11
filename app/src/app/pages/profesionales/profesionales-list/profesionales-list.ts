import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';

import { ProfesionalService } from '../../../core/services/profesional';
import { Profesional, Modalidad } from '../../../core/models/profesional.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-profesionales-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSlideToggleModule,
    MatChipsModule
  ],
  templateUrl: './profesionales-list.html',
  styleUrl: './profesionales-list.css',
})
export class ProfesionalesList {
  private readonly profesionalService = inject(ProfesionalService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly imageUrl = environment.imageUrl;

  isAdminMode = computed(() => this.router.url.includes('/admin'));
  updatingId = signal<number | null>(null);

  columnas = [
    'nombreCompleto',
    'tituloProfesional',
    'modalidad',
    'tarifaBase',
    'disponible',
    'acciones'
  ];

  // DATA
  profesionales = signal<Profesional[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // FILTROS
  search = signal<string>('');
  modalidad = signal<Modalidad | null>(null);
  disponible = signal<boolean | null>(null);

  ngOnInit() {
    this.loadProfesionales();
  }

  loadProfesionales() {
    this.loading.set(true);
    this.error.set(null);

    this.profesionalService.listar().subscribe({
      next: (data) => {
        console.log('PROFESIONALES CARGADOS:', data);
        this.profesionales.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando profesionales:', err);
        this.error.set('No se pudo establecer conexión con el servidor.');
        this.loading.set(false);
      }
    });
  }

  // Filtrado reactivo en el cliente
  profesionalesFiltrados = computed(() => {
    const texto = this.search().toLowerCase().trim();
    const modSel = this.modalidad();
    const dispSel = this.disponible();

    return this.profesionales().filter(p => {
      const nombreCompleto = `${p.usuario?.nombre ?? ''} ${p.usuario?.apellidos ?? ''}`.toLowerCase();
      const titulo = p.tituloProfesional?.toLowerCase() ?? '';

      const coincideTexto =
        !texto ||
        nombreCompleto.includes(texto) ||
        titulo.includes(texto);

      const coincideModalidad =
        !modSel || p.modalidad === modSel;

      const coincideDisponibilidad =
        dispSel === null || dispSel === undefined || p.disponible === dispSel;

      return coincideTexto && coincideModalidad && coincideDisponibilidad;
    });
  });

  totalProfesionales = computed(() => this.profesionalesFiltrados().length);

  cambiarDisponibilidad(p: Profesional): void {
    this.updatingId.set(p.id);
    this.profesionalService.cambiarDisponibilidad(p.id).subscribe({
      next: (res: any) => {
        this.profesionales.update((lista) =>
          lista.map((item) => {
            if (item.id === p.id) {
              const nuevoEstado = !item.disponible;
              return { ...item, disponible: nuevoEstado };
            }
            return item;
          })
        );
        const nuevoEstadoTexto = !p.disponible ? 'Disponible' : 'No disponible';
        this.notification.success(
          `Disponibilidad de ${p.usuario?.nombre} ${p.usuario?.apellidos} actualizada a: ${nuevoEstadoTexto}`
        );
        this.updatingId.set(null);
      },
      error: (err: any) => {
        console.error('Error al cambiar disponibilidad:', err);
        const errorMsg = err.error?.message || 'No se pudo actualizar la disponibilidad.';
        this.notification.error(errorMsg);
        this.updatingId.set(null);
      }
    });
  }

  clearFilters() {
    this.search.set('');
    this.modalidad.set(null);
    this.disponible.set(null);
  }
}
