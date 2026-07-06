import { Profesional } from './profesional.model';
import { Especialidad } from './especialidad.model';


export interface TutorEspecialidad {
    tutorId: number;
    especialidadId: number;

    tutor?: Profesional;
    especialidad?: Especialidad;
}

export interface TutorEspecialidadCreateDto {
    tutorId: number;
    especialidadId: number;
}