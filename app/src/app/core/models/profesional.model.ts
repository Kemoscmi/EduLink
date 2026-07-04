export type Modalidad = 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA' ;

import { Usuario } from './usuario.model';
import { Servicio } from './servicio.model';
import { Cita } from './cita.model';
import { Resena } from './resena.model';
import { TutorEspecialidad } from './tutor-especialidad.model';

export interface Profesional {
    id: number;

    usuarioId: number;

    tituloProfesional: string;
    descripcion?: string | null;
    aniosExperiencia: number;
    modalidad: Modalidad;
    ubicacion: string;
    tarifaBase: number;
    disponible: boolean;
    imagenPerfil: string;

    usuario?: Usuario;

    servicios?: Servicio[];
    tutorEspecialidads?: TutorEspecialidad[];
    citas?: Cita[];
    resenas?: Resena[];

    createAt: string;
    updateAt: string;
}

export interface ProfesionalCreateDto {
    usuarioId: number;
    tituloProfesional: string;
    descripcion?: string | null;
    aniosExperiencia?: number;
    modalidad?: Modalidad;
    ubicacion: string;
    tarifaBase?: number;
    disponible?: boolean;
    imagenPerfil?: string;
}

export interface ProfesionalUpdateDto {
    tituloProfesional?: string;
    descripcion?: string | null;
    aniosExperiencia?: number;
    modalidad?: Modalidad;
    ubicacion?: string;
    tarifaBase?: number;
    disponible?: boolean;
    imagenPerfil?: string;
}