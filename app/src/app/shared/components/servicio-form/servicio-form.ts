import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormField,
  form,
  required,
  min,
  minLength,
  maxLength,
} from '@angular/forms/signals';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  Servicio,
  ServicioCreateDto,
  ServicioFormModel,
  ServicioUpdateDto,
} from '../../../core/models/servicio.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Profesional } from '../../../core/models/profesional.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { untracked } from '@angular/core';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css',
})
export class ServicioForm {
  private readonly authService = inject(AuthenticationService);

  servicio = input<Servicio | null>(null);
  categorias = input<Categoria[]>([]);
  profesionales = input<Profesional[]>([]);
  especialidades = input<Especialidad[]>([]);
  saving = input<boolean>(false);

  guardar = output<ServicioCreateDto | ServicioUpdateDto>();
  cancelar = output<void>();

  esTutor = computed(() => this.authService.rol() === 'TUTOR');

  servicioModel = signal<ServicioFormModel>({
    tutorId: null,
    categoriaId: null,
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 0,
    modalidad: 'PRESENCIAL',
    activo: true,
    especialidadesIds: [],
  });

  servicioForm = form(this.servicioModel, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio' });
    minLength(path.nombre, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(path.nombre, 150, { message: 'Máximo 150 caracteres' });

    required(path.descripcion, { message: 'La descripción es obligatoria' });
    minLength(path.descripcion, 10, { message: 'La descripción debe tener mínimo 10 caracteres' });
    maxLength(path.descripcion, 500, { message: 'Máximo 500 caracteres' });

    required(path.precio, { message: 'El precio es obligatorio' });
    min(path.precio, 1, { message: 'El precio debe ser mayor que cero' });

    required(path.duracion, { message: 'La duración es obligatoria' });
    min(path.duracion, 1, { message: 'La duración debe ser mayor que cero' });

    required(path.categoriaId, { message: 'Seleccione una categoría' });
    required(path.tutorId, { message: 'Seleccione un profesional' });
    required(path.modalidad, { message: 'Seleccione una modalidad' });
  });

  isEdit = computed(() => this.servicio() !== null);
  isSubmitting = computed(() => this.saving());

  constructor() {
    effect(() => {
      const servicio = this.servicio();

      if (!servicio) {
        this.resetForm();
        return;
      }

      this.servicioModel.set({
        tutorId: servicio.tutorId,
        categoriaId: servicio.categoriaId,
        nombre: servicio.nombre ?? '',
        descripcion: servicio.descripcion ?? '',
        precio: Number(servicio.precio ?? 0),
        duracion: servicio.duracion ?? 0,
        modalidad: servicio.modalidad,
        activo: servicio.activo ?? true,
        especialidadesIds:
          servicio.servicioEspecialidades?.map((item) => item.especialidadId) ?? [],
      });
    });

    // Autocompletar tutorId si el usuario autenticado es un Profesional (TUTOR)
    effect(() => {
      const user = this.authService.usuario();
      const profs = this.profesionales();
      
      if (user && user.role === 'TUTOR' && profs.length > 0) {
        const matchingTutor = profs.find(p => p.usuarioId === user.id);
        if (matchingTutor) {
          untracked(() => {
            const currentTutorId = this.servicioModel().tutorId;
            if (currentTutorId !== matchingTutor.id) {
              this.servicioModel.update(m => ({ ...m, tutorId: matchingTutor.id }));
            }
          });
        }
      }
    }, { allowSignalWrites: true });
  }

  toggleEspecialidad(id: number, checked: boolean): void {
    this.servicioModel.update((value) => ({
      ...value,
      especialidadesIds: checked
        ? Array.from(new Set([...value.especialidadesIds, id]))
        : value.especialidadesIds.filter((item) => item !== id),
    }));
  }

  isEspecialidadSelected(id: number): boolean {
    return this.servicioModel().especialidadesIds.includes(id);
  }

  private resetForm(): void {
    this.servicioModel.set({
      tutorId: null,
      categoriaId: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 0,
      modalidad: 'PRESENCIAL',
      activo: true,
      especialidadesIds: [],
    });
  }

  private marcarCamposComoTocados(): void {
    this.servicioForm.nombre().markAsTouched();
    this.servicioForm.descripcion().markAsTouched();
    this.servicioForm.precio().markAsTouched();
    this.servicioForm.duracion().markAsTouched();
    this.servicioForm.categoriaId().markAsTouched();
    this.servicioForm.tutorId().markAsTouched();
    this.servicioForm.modalidad().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.servicioForm.nombre().invalid() ||
      this.servicioForm.descripcion().invalid() ||
      this.servicioForm.precio().invalid() ||
      this.servicioForm.duracion().invalid() ||
      this.servicioForm.categoriaId().invalid() ||
      this.servicioForm.tutorId().invalid() ||
      this.servicioForm.modalidad().invalid()
    );
  }

  private buildDto(): ServicioCreateDto | ServicioUpdateDto {
    const value = this.servicioModel();

    return {
      tutorId: Number(value.tutorId),
      categoriaId: Number(value.categoriaId),
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      precio: Number(value.precio),
      duracion: Number(value.duracion),
      modalidad: value.modalidad,
      activo: value.activo,
      especialidadesIds: value.especialidadesIds,
    };
  }

  submit(): void {
    if (this.isSubmitting()) return;

    this.marcarCamposComoTocados();

    if (this.formularioInvalido()) return;

    const dto = this.buildDto();
    this.guardar.emit(dto);
  }
}
