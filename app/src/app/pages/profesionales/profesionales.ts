import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProfesionalService } from '../../core/services/profesional';
import { Profesional } from '../../core/models/profesional.model';

@Component({
  selector: 'app-profesional-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './profesionales.html',
  styleUrl: './profesionales.css',
})
export class ProfesionalDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profesionalService = inject(ProfesionalService);

  isAdminMode = computed(() => this.router.url.includes('/admin'));

  readonly imageUrl = environment.imageUrl;

  profesional = signal<Profesional | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.cargarDetalle(id);
      } else {
        this.error.set('El ID del profesional no es válido.');
        this.loading.set(false);
      }
    } else {
      this.error.set('No se proporcionó un ID de profesional.');
      this.loading.set(false);
    }
  }

  cargarDetalle(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.profesionalService.obtenerPorId(id).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.profesional.set(res.data);
        } else {
          this.error.set('No se pudo encontrar al profesional solicitado.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando detalle de profesional:', err);
        this.error.set('Error al conectar con el servidor.');
        this.loading.set(false);
      }
    });
  }

  volver(): void {
    const url = this.router.url;
    if (url.includes('/admin/')) {
      this.router.navigate(['/admin/profesionales']);
    } else {
      this.router.navigate(['/profesionales']);
    }
  }
}
