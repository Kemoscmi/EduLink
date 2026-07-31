import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import {
  AceptarCitaDto,
  CancelarCitaDto,
  Cita,
  CitaFiltros,
  HistorialCita,
  RechazarCitaDto,
} from '../models/cita.model';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/citas`;

  getAll(): Observable<Cita[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data?.data || [])
    );
  }

  listar(filtros?: CitaFiltros) {
    let params = new HttpParams();

    if (filtros?.estado) {
      params = params.set('estado', filtros.estado);
    }
    if (filtros?.tutorId) {
      params = params.set('tutorId', filtros.tutorId);
    }
    if (filtros?.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }
    if (filtros?.fechaFin) {
      params = params.set('fechaFin', filtros.fechaFin);
    }
    if (filtros?.page) {
      params = params.set('page', filtros.page);
    }
    if (filtros?.limit) {
      params = params.set('limit', filtros.limit);
    }

    return this.http.get<ApiPaginatedResponse<Cita>>(this.apiUrl, { params });
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`);
  }

  crear(cita: Partial<Cita>): Observable<ApiResponse<Cita>> {
    return this.http.post<ApiResponse<Cita>>(this.apiUrl, cita);
  }

  misCitas(): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(`${this.apiUrl}/mias`);
  }

  historial(id: number): Observable<ApiResponse<HistorialCita[]>> {
    return this.http.get<ApiResponse<HistorialCita[]>>(`${this.apiUrl}/${id}/historial`);
  }

  aceptar(id: number, datos: AceptarCitaDto = {}): Observable<ApiResponse<Cita>> {
    return this.http.patch<ApiResponse<Cita>>(`${this.apiUrl}/${id}/aceptar`, datos);
  }

  rechazar(id: number, datos: RechazarCitaDto): Observable<ApiResponse<Cita>> {
    return this.http.patch<ApiResponse<Cita>>(`${this.apiUrl}/${id}/rechazar`, datos);
  }

  cancelar(id: number, datos: CancelarCitaDto): Observable<ApiResponse<Cita>> {
    return this.http.patch<ApiResponse<Cita>>(`${this.apiUrl}/${id}/cancelar`, datos);
  }

  completar(id: number): Observable<ApiResponse<Cita>> {
    return this.http.patch<ApiResponse<Cita>>(`${this.apiUrl}/${id}/completar`, {});
  }
}
