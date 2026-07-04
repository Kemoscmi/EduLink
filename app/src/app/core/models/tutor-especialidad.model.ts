import { Profesional } from './profesional.model';
import { ServicioEspecialidad } from './servicio-especialidad.model';


export interface TutorEspecialidad {
    tutorId: number;
    especialidadId: number;

    tutor?: Profesional;
    especialidad?: ServicioEspecialidad;
}

export interface TutorEspecialidadCreateDto {
    tutorId: number;
    especialidadId: number;
}