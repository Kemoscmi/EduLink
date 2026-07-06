import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CitaService } from '../../../core/services/cita-service';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-cita-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cita-detail.html',
  styleUrl: './cita-detail.css',
})
export class CitaDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly citasService = inject(CitaService);

  cita = signal<Cita | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.cargarDetalle(id);
      } else {
        this.error.set('El ID de cita proporcionado no es válido.');
        this.loading.set(false);
      }
    } else {
      this.error.set('No se proporcionó un ID de cita.');
      this.loading.set(false);
    }
  }

  cargarDetalle(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.citasService.obtenerPorId(id).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.cita.set(res.data);
        } else {
          this.error.set('No se pudo encontrar la cita solicitada.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando detalle de cita:', err);
        this.error.set('Error al conectar con el servidor.');
        this.loading.set(false);
      }
    });
  }

  volver(): void {
    const url = this.router.url;
    if (url.includes('/admin/')) {
      this.router.navigate(['/admin/citas']);
    } else {
      this.router.navigate(['/citas']);
    }
  }
}
