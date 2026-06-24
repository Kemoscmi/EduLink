import { Categoria } from './categoria.model';

export interface Servicio {
  id: number;
  tutorId: number;
  categoriaId: number;
  nombre: string;
  descripcion: string;
  precio: number | string;
  duracion: number;
  modalidad: 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA';
  activo: boolean;
  createAt?: string;
  updateAt?: string;

  categoria?: Categoria;
  tutor?: {
    id: number;
    usuarioId: number;
    tituloProfesional: string;
    usuario?: UsuarioTutor;
  };

  servicioEspecialidades?: {
    id: number;
    servicioId: number;
    especialidadId: number;
    especialidad: {
      id: number;
      nombre: string;
      descripcion?: string;
      activo: boolean;
    };
  }[];
}

export interface UsuarioTutor {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
}