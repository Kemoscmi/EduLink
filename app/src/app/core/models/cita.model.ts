export type EstadoCita = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA' | 'COMPLETADA';
export type Modalidad = 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA' ;

import { Usuario } from './usuario.model';
import { Servicio } from './servicio.model';
import { Profesional } from './profesional.model';


export interface Cita {
    id: number;

    clienteId: number;
    tutorId: number;
    servicioId: number;

    fechaCita: string;
    horaInicio: string;
    horaFin: string;

    modalidad: Modalidad;
    estado: EstadoCita;

    comentarioCliente: string;
    comentarioTutor?: string | null;

    montoEstimado: number;

    cliente?: Usuario;
    tutor?: Profesional;
    servicio?: Servicio;
    resenas?: any[];

    createAt: string;
    updateAt: string;
}

export interface HistorialCita {
    id: number;
    citaId: number;
    estadoAnterior: EstadoCita | null;
    estadoNuevo: EstadoCita;
    motivo: string | null;
    fecha: string;
}

export interface AceptarCitaDto {
    comentarioTutor?: string;
}

export interface RechazarCitaDto {
    motivo: string;
}

export interface CancelarCitaDto {
    motivo: string;
}

export interface CitaFiltros {
    estado?: EstadoCita;
    tutorId?: number;
    fechaInicio?: string;
    fechaFin?: string;
    page?: number;
    limit?: number;
}