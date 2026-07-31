import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CitaService } from '../../../core/services/cita-service';
import { Cita } from '../../../core/models/cita.model';
import { NotificationService } from '../../../core/services/notification.service';
import { MotivoDialogService } from '../../../core/services/motivo-dialog.service';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [RouterLink, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './mis-citas.html',
  styleUrl: './mis-citas.css',
})
export class MisCitas {
  private readonly citaService = inject(CitaService);
  private readonly notification = inject(NotificationService);
  private readonly motivoDialog = inject(MotivoDialogService);

  citas = signal<Cita[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  actualizandoId = signal<number | null>(null);

  proximas = computed(() =>
    this.citas()
      .filter((c) => (c.estado === 'PENDIENTE' || c.estado === 'ACEPTADA') && this.esFutura(c))
      .sort((a, b) => this.ordenPorFechaHora(a) - this.ordenPorFechaHora(b))
  );

  anteriores = computed(() => {
    const idsProximas = new Set(this.proximas().map((c) => c.id));
    return this.citas()
      .filter((c) => !idsProximas.has(c.id))
      .sort((a, b) => this.ordenPorFechaHora(b) - this.ordenPorFechaHora(a));
  });

  totalCitas = computed(() => this.citas().length);

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.loading.set(true);
    this.error.set(null);

    this.citaService.misCitas().subscribe({
      next: (response) => {
        this.citas.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar su historial de citas.');
        this.loading.set(false);
      },
    });
  }

  puedeCancelar(cita: Cita): boolean {
    return cita.estado === 'PENDIENTE' || cita.estado === 'ACEPTADA';
  }

  cancelar(cita: Cita): void {
    this.motivoDialog
      .solicitar({
        title: 'Cancelar cita',
        message: `¿Por qué desea cancelar la cita de "${cita.servicio?.nombre}" con ${this.nombreProfesional(cita)}?`,
        icon: 'event_busy',
        confirmLabel: 'Cancelar cita',
        danger: true,
        minLength: 5,
      })
      .subscribe((motivo: string | null) => {
        if (!motivo) return;

        this.actualizandoId.set(cita.id);

        this.citaService.cancelar(cita.id, { motivo }).subscribe({
          next: (response) => {
            this.citas.update((lista) =>
              lista.map((item) => (item.id === cita.id ? response.data : item))
            );
            this.notification.success(response.message ?? 'Cita cancelada correctamente');
            this.actualizandoId.set(null);
          },
          error: () => {
            this.actualizandoId.set(null);
          },
        });
      });
  }

  nombreProfesional(cita: Cita): string {
    const usuario = cita.tutor?.usuario;
    return usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Profesional';
  }

  private esFutura(cita: Cita): boolean {
    return this.combinarFechaHora(cita.fechaCita, cita.horaFin).getTime() > Date.now();
  }

  private ordenPorFechaHora(cita: Cita): number {
    return this.combinarFechaHora(cita.fechaCita, cita.horaInicio).getTime();
  }

  private combinarFechaHora(fecha: string, hora: string): Date {
    const [horas, minutos] = hora.split(':').map(Number);
    const base = new Date(fecha);
    return new Date(
      Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), horas || 0, minutos || 0)
    );
  }
}
