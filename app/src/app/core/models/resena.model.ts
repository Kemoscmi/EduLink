import { Cita } from './cita.model';
import { Usuario } from './usuario.model';
import { Profesional } from './profesional.model';

export interface Resena {
    id: number;

    citaId: number;
    clienteId: number;
    tutorId: number;

    puntuacion: number;
    comentario: string;

    cita?: Cita;
    cliente?: Usuario;
    tutor?: Profesional;

    createAt: string;
    updateAt: string;
}

export interface ResenaCreateDto {
    citaId: number;
    clienteId: number;
    tutorId: number;

    puntuacion: number;
    comentario: string;
}

export interface ResenaUpdateDto {
    puntuacion?: number;
    comentario?: string;
}