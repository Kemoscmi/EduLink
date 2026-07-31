import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { FormField, form, required, minLength, maxLength } from '@angular/forms/signals';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CitaService } from '../../../core/services/cita-service';
import { UsuarioService } from '../../../core/services/usuario';
import { ProfesionalService } from '../../../core/services/profesional';
import { ServicioService } from '../../../core/services/servicio';
import { NotificationService } from '../../../core/services/notification.service';

import { Usuario } from '../../../core/models/usuario.model';
import { Profesional } from '../../../core/models/profesional.model';
import { Servicio } from '../../../core/models/servicio.model';
import { Modalidad } from '../../../core/models/cita.model';

export interface CitaFormModel {
  clienteId: number | null;
  tutorId: number | null;
  servicioId: number | null;
  fechaCita: string;
  horaInicio: string;
  horaFin: string;
  modalidad: Modalidad;
  comentarioCliente: string;
}

@Component({
  selector: 'app-cita-create',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cita-create.html',
  styleUrl: './cita-create.css'
})
export class CitaCreate {
  private readonly router = inject(Router);
  private readonly citaService = inject(CitaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly servicioService = inject(ServicioService);
  private readonly notification = inject(NotificationService);

  // DATA SIGNALS
  clientes = signal<Usuario[]>([]);
  profesionales = signal<Profesional[]>([]);
  todosLosServicios = signal<Servicio[]>([]);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  // FORM MODEL SIGNAL
  citaModel = signal<CitaFormModel>({
    clienteId: null,
    tutorId: null,
    servicioId: null,
    fechaCita: '',
    horaInicio: '',
    horaFin: '',
    modalidad: 'PRESENCIAL',
    comentarioCliente: ''
  });

  // SIGNALS Validaciones de Formulario
  citaForm = form(this.citaModel, (path) => {
    required(path.clienteId, { message: 'El cliente es obligatorio' });
    required(path.tutorId, { message: 'El profesional es obligatorio' });
    required(path.servicioId, { message: 'El servicio es obligatorio' });
    required(path.fechaCita, { message: 'La fecha es obligatoria' });
    required(path.horaInicio, { message: 'La hora de inicio es obligatoria' });
    required(path.horaFin, { message: 'La hora de finalización es obligatoria' });
    required(path.modalidad, { message: 'La modalidad es obligatoria' });
    required(path.comentarioCliente, { message: 'La descripción es obligatoria' });
    minLength(path.comentarioCliente, 5, { message: 'La descripción debe tener al menos 5 caracteres' });
    maxLength(path.comentarioCliente, 200, { message: 'La descripción no puede superar los 200 caracteres' });
  });

  // Servicios filtrados dinámicos basados en profesional
  serviciosFiltrados = computed(() => {
    const tutorId = this.citaModel().tutorId;
    if (!tutorId) return [];
    return this.todosLosServicios().filter(s => s.tutorId === tutorId && s.activo);
  });

  constructor() {
    this.cargarDatosFormulario();

    // Restablecer el servicio seleccionado si ya no se encuentra en los servicios filtrados del tutor.
    effect(() => {
      const tutorId = this.citaModel().tutorId;
      const model = untracked(() => this.citaModel());

      if (model.servicioId && this.serviciosFiltrados().findIndex(s => s.id === model.servicioId) === -1) {
        this.citaModel.update(m => ({ ...m, servicioId: null, horaFin: '' }));
      }
    }, { allowSignalWrites: true });

    // Calcula horaFin y precarga la modalidad cuando cambie horaInicio o servicioId.
    effect(() => {
      // Trigger dependencies
      const horaInicio = this.citaModel().horaInicio;
      const servicioId = this.citaModel().servicioId;

      // Leer el modelo sin seguimiento para evitar bucles infinitos al actualizar modality/horaFin
      const model = untracked(() => this.citaModel());

      if (!servicioId) {
        if (model.horaFin) {
          this.citaModel.update(m => ({ ...m, horaFin: '' }));
        }
        return;
      }

      const servicio = this.todosLosServicios().find(s => s.id === servicioId);
      if (servicio) {
        let updates: Partial<CitaFormModel> = {};

        // Solo actualiza la modalidad si difiere y no es MIXTA.
        if (servicio.modalidad && servicio.modalidad !== 'MIXTA' && model.modalidad !== servicio.modalidad) {
          updates.modalidad = servicio.modalidad;
        }

        //Actualiza horaFin solo si difiere.
        if (horaInicio && servicio.duracion) {
          const calculatedFin = this.calcularHoraFin(horaInicio, servicio.duracion);
          if (model.horaFin !== calculatedFin) {
            updates.horaFin = calculatedFin;
          }
        } else if (!horaInicio && model.horaFin) {
          updates.horaFin = '';
        }

        if (Object.keys(updates).length > 0) {
          this.citaModel.update(m => ({
            ...m,
            ...updates
          }));
        }
      }
    }, { allowSignalWrites: true });
  }

  cargarDatosFormulario(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      usuarios: this.usuarioService.listar(),
      profesionales: this.profesionalService.listar(),
      servicios: this.servicioService.listar()
    }).subscribe({
      next: ({ usuarios, profesionales, servicios }) => {
        // Filtrar usuarios para obtener solo clientes con active = true y role = USER
        const clientsOnly = (usuarios.data ?? []).filter(u => u.activo && u.role === 'USER');
        this.clientes.set(clientsOnly);

        // Carga todos los profesionales
        this.profesionales.set(profesionales ?? []);

        // Guardar servicios activos
        const activeServs = (servicios.data ?? []).filter(s => s.activo);
        this.todosLosServicios.set(activeServs);
      },
      error: (err) => {
        console.error('Error al cargar datos de catálogos:', err);
        this.error.set('No se pudieron cargar los datos necesarios para registrar la cita.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  calcularHoraFin(horaInicio: string, duracionMinutos: number): string {
    const [horasStr, minutosStr] = horaInicio.split(':');
    const horas = parseInt(horasStr, 10);
    const minutos = parseInt(minutosStr, 10);

    if (isNaN(horas) || isNaN(minutos)) return '';

    const totalMinutos = horas * 60 + minutos + duracionMinutos;
    const finHoras = Math.floor(totalMinutos / 60) % 24;
    const finMinutos = totalMinutos % 60;

    const horasPad = String(finHoras).padStart(2, '0');
    const minutosPad = String(finMinutos).padStart(2, '0');

    return `${horasPad}:${minutosPad}`;
  }

  private marcarCamposComoTocados(): void {
    this.citaForm.clienteId().markAsTouched();
    this.citaForm.tutorId().markAsTouched();
    this.citaForm.servicioId().markAsTouched();
    this.citaForm.fechaCita().markAsTouched();
    this.citaForm.horaInicio().markAsTouched();
    this.citaForm.modalidad().markAsTouched();
    this.citaForm.comentarioCliente().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.citaForm.clienteId().invalid() ||
      this.citaForm.tutorId().invalid() ||
      this.citaForm.servicioId().invalid() ||
      this.citaForm.fechaCita().invalid() ||
      this.citaForm.horaInicio().invalid() ||
      this.citaForm.horaFin().invalid() ||
      this.citaForm.modalidad().invalid() ||
      this.citaForm.comentarioCliente().invalid()
    );
  }

  submit(): void {
    if (this.saving()) return;

    this.marcarCamposComoTocados();

    if (this.formularioInvalido()) {
      this.notification.error('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    const val = this.citaModel();
    
    // Validar que no se agende en una fecha pasada
    const selectedDate = new Date(val.fechaCita);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      this.notification.error('La fecha de la cita no puede ser anterior al día de hoy.');
      return;
    }

    // Validar que el cliente no sea el mismo que el profesional asignado
    const selectedPro = this.profesionales().find(p => p.id === val.tutorId);
    if (selectedPro && selectedPro.usuarioId === val.clienteId) {
      this.notification.error('Un profesional no puede agendar una cita consigo mismo como cliente.');
      return;
    }

    this.saving.set(true);

    const dto = {
      clienteId: Number(val.clienteId),
      tutorId: Number(val.tutorId),
      servicioId: Number(val.servicioId),
      fechaCita: new Date(val.fechaCita).toISOString(),
      horaInicio: val.horaInicio,
      horaFin: val.horaFin,
      modalidad: val.modalidad,
      comentarioCliente: val.comentarioCliente.trim()
    };

    this.citaService.crear(dto).subscribe({
      next: (response) => {
        this.notification.success(response.message ?? 'Cita registrada correctamente');
        this.router.navigate(['/admin/citas']);
      },
      error: (err) => {
        console.error('Error al registrar cita:', err);
        const errorMsg = err.error?.message || 'Ocurrió un error al registrar la cita.';
        this.notification.error(errorMsg);
        this.saving.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/citas']);
  }
}
