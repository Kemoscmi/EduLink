import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface CitasEstadoFiltros {
  tutorId?: number;
  categoriaId?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reportes`;

  getCitasPorEstado(filtros?: CitasEstadoFiltros): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.tutorId) {
        params = params.set('tutorId', filtros.tutorId.toString());
      }
      if (filtros.categoriaId) {
        params = params.set('categoriaId', filtros.categoriaId.toString());
      }
      if (filtros.fechaInicio) {
        params = params.set('fechaInicio', filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        params = params.set('fechaFin', filtros.fechaFin);
      }
    }
    return this.http.get<any>(`${this.apiUrl}/citas-estado`, { params });
  }

  getCitasPorProfesional(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/citas-profesional`);
  }

  getCalificaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/calificaciones`);
  }
}
