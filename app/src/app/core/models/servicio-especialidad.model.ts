import { Servicio } from './servicio.model';
import { Especialidad } from './especialidad.model';

export interface ServicioEspecialidad {
    servicioId: number;
    especialidadId: number;

    servicio?: Servicio;
    especialidad?: Especialidad;
}

export interface ServicioEspecialidadCreateDto {
    servicioId: number;
    especialidadId: number;
}