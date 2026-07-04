import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { CitaService } from '../../../core/services/cita-service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { Profesional } from '../../../core/models/profesional.model';
import { ProfesionalService } from '../../../core/services/profesional';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './citas-list.html',
  styleUrl: './citas-list.css'
})
export class CitasList {
  constructor(
    private citasService: CitaService,
    private profesionalService: ProfesionalService
  ) {}

  // DATA
  citas = signal<Cita[]>([]);
  profesionales = signal<Profesional[]>([]);

  // FILTROS (SIGNALS)
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  search = signal<string>('');
  estado = signal<EstadoCita | null>(null);
  profesionalId = signal<number | null>(null);
  fechaInicio = signal<string | null>(null);
  fechaFin = signal<string | null>(null);

  ngOnInit() {
    this.loadCitas();
    this.loadProfesionalesList();
  }

  // Búsqueda por Filtros
  citasFiltradas = computed(() => {
    const texto = this.search().toLowerCase().trim();
    const estadoSel = this.estado();
    const profSel = this.profesionalId();
    const fechaIni = this.fechaInicio();
    const fechaFin = this.fechaFin();

    return this.citas().filter(cita => {

      const cliente = `${cita.cliente?.nombre ?? ''} ${cita.cliente?.apellidos ?? ''}`.toLowerCase();
      const servicio = cita.servicio?.nombre?.toLowerCase() ?? '';
      const profesional = `${cita.tutor?.usuario?.nombre ?? ''} ${cita.tutor?.usuario?.apellidos ?? ''}`.toLowerCase();

      const coincideTexto =
        !texto ||
        cliente.includes(texto) ||
        servicio.includes(texto) ||
        profesional.includes(texto);

      const coincideEstado =
        !estadoSel || cita.estado === estadoSel;

      const coincideProfesional =
        !profSel || cita.tutorId === profSel;

      const citaFechaStr = cita.fechaCita ? cita.fechaCita.substring(0, 10) : '';
      const coincideFecha =
        (!fechaIni || citaFechaStr >= fechaIni) &&
        (!fechaFin || citaFechaStr <= fechaFin);

      return coincideTexto && coincideEstado && coincideProfesional && coincideFecha;
    });
  });

  totalCitas = computed(() => this.citasFiltradas().length);

  // Limpiar Filtros
  clearFilters() {
    this.search.set('');
    this.estado.set(null);
    this.profesionalId.set(null);
    this.fechaInicio.set(null);
    this.fechaFin.set(null);
  }


  // CARGA DE DATOS DE CITAS
  loadCitas() {
    this.loading.set(true);

    this.citasService.getAll().subscribe({
      next: (data) => {
        console.log('CITAS:', data); 
        this.citas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error cargando citas');
        this.loading.set(false);
      }
    });
  }

  // CARGA DE DATOS DE PROFESIONALES

  loadProfesionales(data: Profesional[]) {
    this.profesionales.set(data);
  }

  loadProfesionalesList() {
    this.profesionalService.listar().subscribe({
      next: (data) => {
        this.loadProfesionales(data);
      },
      error: (err) => {
        console.error('Error cargando profesionales:', err);
      }
    });
  }
}