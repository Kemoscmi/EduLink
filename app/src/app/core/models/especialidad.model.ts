import { TutorEspecialidad } from './tutor-especialidad.model';
import { ServicioEspecialidad } from './servicio-especialidad.model';

export interface Especialidad {
    id: number;

    nombre: string;
    descripcion?: string | null;
    activo: boolean;

    tutorEspecialidades?: TutorEspecialidad[];
    servicioEspecialidades?: ServicioEspecialidad[];

    createAt: string;
    updateAt: string;
}

export interface EspecialidadCreateDto {
    nombre: string;
    descripcion?: string | null;
    activo?: boolean;
}

export interface EspecialidadUpdateDto {
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
}