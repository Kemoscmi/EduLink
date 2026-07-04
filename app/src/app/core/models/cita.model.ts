export type EstadoCita = 'PENDIENTE' | 'PAGADA' | 'REALIZADA' | 'CANCELADA';
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

    createAt: string;
    updateAt: string;
}