import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ServicioService } from '../../../core/services/servicio';
import { Servicio } from '../../../core/models/servicio.model';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-servicio-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './servicio-detail-page.html',
  styleUrl: './servicio-detail-page.css',
})
export class ServicioDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);
  private readonly authService = inject(AuthenticationService);

  isAdminMode = computed(() => this.router.url.includes('/admin'));
  esCliente = computed(() => this.authService.rol() === 'USER');

  servicio = signal<Servicio | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('El identificador del servicio no es válido.');
      return;
    }

    this.loadServicio(id);
  }

  loadServicio(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicioService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.servicio.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el detalle del servicio.');
        this.loading.set(false);
      },
    });
  }

  nombreProfesional(servicio: Servicio): string {
    const usuario = servicio.tutor?.usuario;
    return usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Sin asignar';
  }
}
