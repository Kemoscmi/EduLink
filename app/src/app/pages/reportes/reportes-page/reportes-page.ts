import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ReportesService, CitasEstadoFiltros } from '../../../core/services/reportes.service';
import { CategoriaService } from '../../../core/services/categoria';
import { ProfesionalService } from '../../../core/services/profesional';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Categoria } from '../../../core/models/categoria.model';
import { Profesional } from '../../../core/models/profesional.model';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './reportes-page.html',
  styleUrl: './reportes-page.css',
})
export class ReportesPage implements OnInit {
  private readonly reportesService = inject(ReportesService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly authService = inject(AuthenticationService);
  private readonly notification = inject(NotificationService);

  // Filtros
  tutorId = signal<number | null>(null);
  categoriaId = signal<number | null>(null);
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  // Info Auxiliar para Filtros
  profesionales = signal<Profesional[]>([]);
  categorias = signal<Categoria[]>([]);

  // Datos de los Reportes
  citasEstadoLoading = signal(false);
  citasEstadoError = signal<string | null>(null);
  citasEstadoReport = signal<any>(null);

  citasProfesionalLoading = signal(false);
  citasProfesionalError = signal<string | null>(null);
  citasProfesionalReport = signal<any[]>([]);

  calificacionesLoading = signal(false);
  calificacionesError = signal<string | null>(null);
  calificacionesReport = signal<any[]>([]);

  // Periodo Aplicado
  periodoAplicado = signal<string>('Todo el histórico');

  // Datos del Usuario
  currentUser = this.authService.usuario;
  isAdmin = this.authService.esAdmin;

  // Columnas para tablas
  citasColumnas = ['fecha', 'hora', 'cliente', 'profesional', 'servicio', 'estado', 'monto'];
  profesionalesColumnas = ['profesional', 'total', 'completadas', 'progreso'];
  calificacionesColumnas = ['profesional', 'promedio', 'cantidad', 'mejor', 'bajas'];

  ngOnInit(): void {
    // 1. Cargar Categorías
    this.categoriaService.listar().subscribe({
      next: (res) => {
        this.categorias.set(res.data?.filter((c) => c.activo) || []);
      },
    });

    // 2. Cargar Profesionales (Solo si es Administrador)
    if (this.isAdmin()) {
      this.profesionalService.listar().subscribe({
        next: (res) => {
          this.profesionales.set(res || []);
        },
      });
    }

    // 3. Cargar Reportes inicialmente
    this.loadAllReports();
  }

  loadAllReports(): void {
    this.loadCitasEstado();
    this.loadCitasProfesional();
    this.loadCalificaciones();
  }

  loadCitasEstado(): void {
    this.citasEstadoLoading.set(true);
    this.citasEstadoError.set(null);

    const filtros: CitasEstadoFiltros = {};
    if (this.tutorId()) filtros.tutorId = this.tutorId()!;
    if (this.categoriaId()) filtros.categoriaId = this.categoriaId()!;
    if (this.fechaInicio()) filtros.fechaInicio = this.fechaInicio();
    if (this.fechaFin()) filtros.fechaFin = this.fechaFin();

    this.reportesService.getCitasPorEstado(filtros).subscribe({
      next: (res) => {
        this.citasEstadoReport.set(res.data);
        this.citasEstadoLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.citasEstadoError.set('No se pudieron obtener los datos de citas por estado.');
        this.citasEstadoLoading.set(false);
      },
    });
  }

  loadCitasProfesional(): void {
    this.citasProfesionalLoading.set(true);
    this.citasProfesionalError.set(null);

    this.reportesService.getCitasPorProfesional().subscribe({
      next: (res) => {
        this.citasProfesionalReport.set(res.data);
        this.citasProfesionalLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.citasProfesionalError.set('No se pudieron obtener los datos de citas por profesional.');
        this.citasProfesionalLoading.set(false);
      },
    });
  }

  loadCalificaciones(): void {
    this.calificacionesLoading.set(true);
    this.calificacionesError.set(null);

    this.reportesService.getCalificaciones().subscribe({
      next: (res) => {
        this.calificacionesReport.set(res.data);
        this.calificacionesLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.calificacionesError.set('No se pudieron obtener las calificaciones.');
        this.calificacionesLoading.set(false);
      },
    });
  }

  formatFechaDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  validarYFiltrar(): void {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();

    if (inicio && fin && new Date(inicio) > new Date(fin)) {
      this.notification.error('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    // Actualizar etiqueta del período aplicado
    if (inicio && fin) {
      this.periodoAplicado.set(`Del ${this.formatFechaDisplay(inicio)} al ${this.formatFechaDisplay(fin)}`);
    } else if (inicio) {
      this.periodoAplicado.set(`Desde ${this.formatFechaDisplay(inicio)}`);
    } else if (fin) {
      this.periodoAplicado.set(`Hasta ${this.formatFechaDisplay(fin)}`);
    } else {
      this.periodoAplicado.set('Todo el histórico');
    }

    // Recargar citas por estado
    this.loadCitasEstado();
  }

  limpiarFiltros(): void {
    this.tutorId.set(null);
    this.categoriaId.set(null);
    this.fechaInicio.set('');
    this.fechaFin.set('');
    this.periodoAplicado.set('Todo el histórico');
    this.loadCitasEstado();
  }

  // Genera estrellas HTML o CSS basadas en la calificación
  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('star');
      } else if (i === fullStars && hasHalf) {
        stars.push('star_half');
      } else {
        stars.push('star_border');
      }
    }
    return stars;
  }

  // Traducción y estilo de los estados de citas
  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      ACEPTADA: 'Aceptada',
      RECHAZADA: 'Rechazada',
      CANCELADA: 'Cancelada',
      COMPLETADA: 'Completada',
    };
    return labels[estado] || estado;
  }

  getEstadoClass(estado: string): string {
    const classes: Record<string, string> = {
      PENDIENTE: 'estado-pendiente',
      ACEPTADA: 'estado-aceptada',
      RECHAZADA: 'estado-rechazada',
      CANCELADA: 'estado-cancelada',
      COMPLETADA: 'estado-completada',
    };
    return classes[estado] || '';
  }
}
