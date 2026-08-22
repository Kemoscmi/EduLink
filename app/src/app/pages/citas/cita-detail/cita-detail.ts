import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { CitaService } from '../../../core/services/cita-service';
import { Cita, HistorialCita } from '../../../core/models/cita.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { MotivoDialogService } from '../../../core/services/motivo-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ResenaDialog } from '../../../shared/components/resena-dialog/resena-dialog';

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
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly motivoDialog = inject(MotivoDialogService);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthenticationService);

  cita = signal<Cita | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  historial = signal<HistorialCita[]>([]);
  procesando = signal(false);

  esCliente = computed(() => this.authService.rol() === 'USER');
  esTutor = computed(() => this.authService.rol() === 'TUTOR');
  esAdmin = computed(() => this.authService.rol() === 'ADMIN');

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
          this.cargarHistorial(id);
        } else {
          this.error.set('No se pudo encontrar la cita solicitada.');
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Error cargando detalle de cita:', err);
        this.error.set('Error al conectar con el servidor.');
        this.loading.set(false);
      }
    });
  }

  cargarHistorial(id: number): void {
    this.citasService.historial(id).subscribe({
      next: (res) => {
        this.historial.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando historial de cambios:', err);
        this.loading.set(false);
      }
    });
  }

  nombreCliente(cita: Cita): string {
    const cliente = cita.cliente;
    return cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cliente';
  }

  nombreProfesional(cita: Cita): string {
    const usuario = cita.tutor?.usuario;
    return usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Profesional';
  }

  puedeAceptarORechazar(cita: Cita): boolean {
    return cita.estado === 'PENDIENTE' && (this.esTutor() || this.esAdmin());
  }

  puedeCancelar(cita: Cita): boolean {
    if (cita.estado === 'PENDIENTE') {
      return this.esCliente() || this.esAdmin(); // El tutor no puede cancelar si está Pendiente
    }
    if (cita.estado === 'ACEPTADA') {
      return this.esCliente() || this.esTutor() || this.esAdmin();
    }
    return false;
  }

  puedeCompletar(cita: Cita): boolean {
    if (cita.estado !== 'ACEPTADA') return false;
    if (!this.esTutor() && !this.esAdmin()) return false;
    return this.combinarFechaHora(cita.fechaCita, cita.horaFin).getTime() <= Date.now();
  }

  aceptar(cita: Cita): void {
    this.motivoDialog
      .solicitar({
        title: 'Aceptar cita',
        message: `¿Desea aceptar la cita de "${cita.servicio?.nombre}" con ${this.nombreCliente(cita)}? Ingrese un comentario opcional si lo desea.`,
        motivoLabel: 'Comentario opcional',
        icon: 'event_available',
        confirmLabel: 'Aceptar',
        optional: true,
        minLength: 0,
      })
      .subscribe((comentario: string | null) => {
        if (comentario === null) return;
        this.ejecutarAction(
          this.citasService.aceptar(cita.id, { comentarioTutor: comentario }),
          'Cita aceptada correctamente'
        );
      });
  }

  rechazar(cita: Cita): void {
    this.motivoDialog
      .solicitar({
        title: 'Rechazar cita',
        message: `Indique el motivo por el cual rechaza la cita de "${cita.servicio?.nombre}" con ${this.nombreCliente(cita)}.`,
        icon: 'event_busy',
        confirmLabel: 'Rechazar cita',
        danger: true,
      })
      .subscribe((motivo: string | null) => {
        if (!motivo) return;
        this.ejecutarAction(
          this.citasService.rechazar(cita.id, { motivo }),
          'Cita rechazada correctamente'
        );
      });
  }

  cancelarAccion(cita: Cita): void {
    this.motivoDialog
      .solicitar({
        title: 'Cancelar cita',
        message: `Indique el motivo por el cual cancela la cita de "${cita.servicio?.nombre}" con ${this.nombreProfesional(cita)}.`,
        icon: 'event_busy',
        confirmLabel: 'Cancelar cita',
        danger: true,
      })
      .subscribe((motivo: string | null) => {
        if (!motivo) return;
        this.ejecutarAction(
          this.citasService.cancelar(cita.id, { motivo }),
          'Cita cancelada correctamente'
        );
      });
  }

  completar(cita: Cita): void {
    this.confirmDialog
      .confirm({
        title: 'Marcar como completada',
        message: `¿Confirma que la cita de "${cita.servicio?.nombre}" con ${this.nombreCliente(cita)} ya se realizó?`,
        icon: 'task_alt',
        confirmLabel: 'Completar',
      })
      .subscribe((confirmado: boolean) => {
        if (!confirmado) return;
        this.ejecutarAction(
          this.citasService.completar(cita.id),
          'Cita marcada como completada'
        );
      });
  }

  calificar(cita: Cita): void {
    this.dialog
      .open(ResenaDialog, {
        width: '450px',
        data: {
          servicioNombre: cita.servicio?.nombre || 'Clase',
          tutorNombre: this.nombreProfesional(cita)
        }
      })
      .afterClosed()
      .subscribe((datos: { puntuacion: number; comentario: string } | null) => {
        if (!datos) return;
        this.procesando.set(true);
        this.citasService.crearResena(cita.id, datos).subscribe({
          next: (res) => {
            this.notification.success(res.message ?? '¡Gracias por calificar el servicio!');
            this.procesando.set(false);
            this.cargarDetalle(cita.id);
          },
          error: (err) => {
            console.error('Error calificando cita:', err);
            this.procesando.set(false);
          }
        });
      });
  }

  private ejecutarAction(observable: any, mensajeExito: string): void {
    this.procesando.set(true);
    observable.subscribe({
      next: (response: any) => {
        this.notification.success(response.message ?? mensajeExito);
        this.procesando.set(false);
        this.cargarDetalle(response.data.id || this.cita()?.id);
      },
      error: () => {
        this.procesando.set(false);
      },
    });
  }

  private combinarFechaHora(fecha: string, hora: string): Date {
    const [horas, minutos] = hora.split(':').map(Number);
    const base = new Date(fecha);
    return new Date(
      Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), horas || 0, minutos || 0)
    );
  }

  volver(): void {
    const url = this.router.url;
    if (url.includes('/admin/')) {
      this.router.navigate(['/admin/citas']);
    } else {
      this.router.navigate(['/mis-citas']);
    }
  }
}
