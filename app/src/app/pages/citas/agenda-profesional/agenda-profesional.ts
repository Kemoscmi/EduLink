import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { CitaService } from '../../../core/services/cita-service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { MotivoDialogService } from '../../../core/services/motivo-dialog.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

const COLOR_ESTADO: Record<EstadoCita, string> = {
  PENDIENTE: '#f59e0b',
  ACEPTADA: '#3b82f6',
  RECHAZADA: '#9333ea',
  CANCELADA: '#e11d48',
  COMPLETADA: '#16a34a',
};

interface EstadoOption {
  value: EstadoCita;
  label: string;
}

@Component({
  selector: 'app-agenda-profesional',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    FullCalendarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './agenda-profesional.html',
  styleUrl: './agenda-profesional.css',
})
export class AgendaProfesional {
  private readonly citaService = inject(CitaService);
  private readonly notification = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly motivoDialog = inject(MotivoDialogService);
  private readonly authService = inject(AuthenticationService);

  esAdmin = this.authService.esAdmin;

  citas = signal<Cita[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  citaSeleccionada = signal<Cita | null>(null);
  procesando = signal(false);
  filtroEstado = signal<EstadoCita | null>(null);

  estados: EstadoOption[] = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'ACEPTADA', label: 'Aceptada' },
    { value: 'RECHAZADA', label: 'Rechazada' },
    { value: 'CANCELADA', label: 'Cancelada' },
    { value: 'COMPLETADA', label: 'Completada' },
  ];

  citasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    return this.citas().filter((c) => !filtro || c.estado === filtro);
  });

  totalCitas = computed(() => this.citas().length);

  eventosCalendario = computed<EventInput[]>(() =>
    this.citasFiltradas().map((cita) => ({
      id: String(cita.id),
      title: `${cita.servicio?.nombre ?? 'Servicio'} · ${this.nombreCliente(cita)}`,
      start: this.combinarFechaHora(cita.fechaCita, cita.horaInicio),
      end: this.combinarFechaHora(cita.fechaCita, cita.horaFin),
      backgroundColor: COLOR_ESTADO[cita.estado],
      borderColor: COLOR_ESTADO[cita.estado],
    }))
  );

  calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana', list: 'Lista' },
    locale: 'es',
    firstDay: 1,
    allDaySlot: false,
    height: 'auto',
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    eventClick: (arg: EventClickArg) => this.seleccionarPorId(Number(arg.event.id)),
  }));

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.esAdmin()) {
      this.citaService.getAll().subscribe({
        next: (citas) => {
          this.citas.set(citas ?? []);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar la agenda general.');
          this.loading.set(false);
        },
      });
      return;
    }

    this.citaService.misCitas().subscribe({
      next: (response) => {
        this.citas.set(response.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar su agenda.');
        this.loading.set(false);
      },
    });
  }

  seleccionarPorId(id: number): void {
    const cita = this.citas().find((c) => c.id === id) ?? null;
    this.citaSeleccionada.set(cita);
  }

  cerrarDetalle(): void {
    this.citaSeleccionada.set(null);
  }

  nombreCliente(cita: Cita): string {
    const cliente = cita.cliente;
    return cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cliente';
  }

  estadoLabel(estado: EstadoCita): string {
    return this.estados.find((item) => item.value === estado)?.label ?? estado;
  }

  puedeAceptarORechazar(cita: Cita): boolean {
    return cita.estado === 'PENDIENTE';
  }

  puedeCancelar(cita: Cita): boolean {
    return cita.estado === 'PENDIENTE' || cita.estado === 'ACEPTADA';
  }

  puedeCompletar(cita: Cita): boolean {
    if (cita.estado !== 'ACEPTADA') return false;
    return new Date(this.combinarFechaHora(cita.fechaCita, cita.horaFin)).getTime() <= Date.now();
  }

  yaPaso(cita: Cita): boolean {
    return new Date(this.combinarFechaHora(cita.fechaCita, cita.horaFin)).getTime() <= Date.now();
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
        this.ejecutar(
          this.citaService.aceptar(cita.id, { comentarioTutor: comentario }),
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
        this.ejecutar(this.citaService.rechazar(cita.id, { motivo }), 'Cita rechazada correctamente');
      });
  }

  cancelar(cita: Cita): void {
    this.motivoDialog
      .solicitar({
        title: 'Cancelar cita',
        message: `Indique el motivo por el cual cancela la cita de "${cita.servicio?.nombre}" con ${this.nombreCliente(cita)}.`,
        icon: 'event_busy',
        confirmLabel: 'Cancelar cita',
        danger: true,
      })
      .subscribe((motivo: string | null) => {
        if (!motivo) return;
        this.ejecutar(this.citaService.cancelar(cita.id, { motivo }), 'Cita cancelada correctamente');
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
        this.ejecutar(this.citaService.completar(cita.id), 'Cita marcada como completada');
      });
  }

  private ejecutar(observable: ReturnType<CitaService['aceptar']>, mensajeExito: string): void {
    this.procesando.set(true);

    observable.subscribe({
      next: (response) => {
        this.citas.update((lista) =>
          lista.map((item) => (item.id === response.data.id ? response.data : item))
        );
        this.citaSeleccionada.set(response.data);
        this.notification.success(response.message ?? mensajeExito);
        this.procesando.set(false);
      },
      error: () => {
        this.procesando.set(false);
      },
    });
  }

  clearFiltro(): void {
    this.filtroEstado.set(null);
  }

  private combinarFechaHora(fecha: string, hora: string): string {
    const [horas, minutos] = hora.split(':');
    const base = new Date(fecha);
    const yyyy = base.getUTCFullYear();
    const mm = String(base.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(base.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${horas}:${minutos}:00`;
  }
}
