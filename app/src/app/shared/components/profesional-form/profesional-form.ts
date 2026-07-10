import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormField,
  form,
  required,
  min,
  minLength,
  maxLength,
  email,
} from '@angular/forms/signals';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Profesional, Modalidad } from '../../../core/models/profesional.model';

export interface ProfesionalFormModel {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  tituloProfesional: string;
  descripcion: string;
  aniosExperiencia: number;
  modalidad: Modalidad;
  ubicacion: string;
  tarifaBase: number;
  disponible: boolean;
  imagenPerfil: string;
}

@Component({
  selector: 'app-profesional-form',
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
  templateUrl: './profesional-form.html',
  styleUrl: './profesional-form.css',
})
export class ProfesionalForm {
  profesional = input<Profesional | null>(null);
  saving = input<boolean>(false);

  guardar = output<any>();
  cancelar = output<void>();

  profesionalModel = signal<ProfesionalFormModel>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    tituloProfesional: '',
    descripcion: '',
    aniosExperiencia: 0,
    modalidad: 'MIXTA',
    ubicacion: '',
    tarifaBase: 5000,
    disponible: true,
    imagenPerfil: 'image-not-found.jpg',
  });

  profesionalForm = form(this.profesionalModel, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio' });
    maxLength(path.nombre, 120, { message: 'Máximo 120 caracteres' });

    required(path.apellidos, { message: 'Los apellidos son obligatorios' });
    maxLength(path.apellidos, 170, { message: 'Máximo 170 caracteres' });

    required(path.email, { message: 'El correo electrónico es obligatorio' });
    email(path.email, { message: 'Ingrese un correo electrónico válido' });
    maxLength(path.email, 150, { message: 'Máximo 150 caracteres' });

    required(path.telefono, { message: 'El teléfono es obligatorio' });
    minLength(path.telefono, 8, { message: 'Mínimo 8 caracteres' });
    maxLength(path.telefono, 20, { message: 'Máximo 20 caracteres' });

    required(path.tituloProfesional, { message: 'El título profesional es obligatorio' });
    maxLength(path.tituloProfesional, 300, { message: 'Máximo 300 caracteres' });

    maxLength(path.descripcion, 255, { message: 'La descripción no puede exceder 255 caracteres' });

    required(path.aniosExperiencia, { message: 'Los años de experiencia son obligatorios' });
    min(path.aniosExperiencia, 0, { message: 'Los años de experiencia no pueden ser negativos' });

    required(path.modalidad, { message: 'Seleccione una modalidad de trabajo' });

    required(path.ubicacion, { message: 'La ubicación es obligatoria' });
    maxLength(path.ubicacion, 255, { message: 'Máximo 255 caracteres' });

    required(path.tarifaBase, { message: 'La tarifa base es obligatoria' });
    min(path.tarifaBase, 1, { message: 'La tarifa base debe ser mayor que cero' });

    required(path.imagenPerfil, { message: 'La imagen de perfil es obligatoria' });
    maxLength(path.imagenPerfil, 255, { message: 'El nombre de la imagen o URL no puede exceder 255 caracteres' });
  });

  isEdit = computed(() => this.profesional() !== null);
  isSubmitting = computed(() => this.saving());

  constructor() {
    effect(() => {
      const p = this.profesional();

      if (!p) {
        this.resetForm();
        return;
      }

      this.profesionalModel.set({
        nombre: p.usuario?.nombre ?? '',
        apellidos: p.usuario?.apellidos ?? '',
        email: p.usuario?.email ?? '',
        telefono: p.usuario?.telefono ?? '',
        tituloProfesional: p.tituloProfesional ?? '',
        descripcion: p.descripcion ?? '',
        aniosExperiencia: p.aniosExperiencia ?? 0,
        modalidad: p.modalidad ?? 'MIXTA',
        ubicacion: p.ubicacion ?? '',
        tarifaBase: Number(p.tarifaBase ?? 0),
        disponible: p.disponible ?? true,
        imagenPerfil: p.imagenPerfil ?? 'image-not-found.jpg',
      });
    });
  }

  private resetForm(): void {
    this.profesionalModel.set({
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      tituloProfesional: '',
      descripcion: '',
      aniosExperiencia: 0,
      modalidad: 'MIXTA',
      ubicacion: '',
      tarifaBase: 5000,
      disponible: true,
      imagenPerfil: 'image-not-found.jpg',
    });
  }

  private marcarCamposComoTocados(): void {
    this.profesionalForm.nombre().markAsTouched();
    this.profesionalForm.apellidos().markAsTouched();
    this.profesionalForm.email().markAsTouched();
    this.profesionalForm.telefono().markAsTouched();
    this.profesionalForm.tituloProfesional().markAsTouched();
    this.profesionalForm.descripcion().markAsTouched();
    this.profesionalForm.aniosExperiencia().markAsTouched();
    this.profesionalForm.modalidad().markAsTouched();
    this.profesionalForm.ubicacion().markAsTouched();
    this.profesionalForm.tarifaBase().markAsTouched();
    this.profesionalForm.imagenPerfil().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.profesionalForm.nombre().invalid() ||
      this.profesionalForm.apellidos().invalid() ||
      this.profesionalForm.email().invalid() ||
      this.profesionalForm.telefono().invalid() ||
      this.profesionalForm.tituloProfesional().invalid() ||
      this.profesionalForm.descripcion().invalid() ||
      this.profesionalForm.aniosExperiencia().invalid() ||
      this.profesionalForm.modalidad().invalid() ||
      this.profesionalForm.ubicacion().invalid() ||
      this.profesionalForm.tarifaBase().invalid() ||
      this.profesionalForm.imagenPerfil().invalid()
    );
  }

  private buildDto(): any {
    const value = this.profesionalModel();
    return {
      nombre: value.nombre.trim(),
      apellidos: value.apellidos.trim(),
      email: value.email.trim(),
      telefono: value.telefono.trim(),
      tituloProfesional: value.tituloProfesional.trim(),
      descripcion: value.descripcion?.trim() || null,
      aniosExperiencia: Number(value.aniosExperiencia),
      modalidad: value.modalidad,
      ubicacion: value.ubicacion.trim(),
      tarifaBase: Number(value.tarifaBase),
      disponible: value.disponible,
      imagenPerfil: value.imagenPerfil.trim(),
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
