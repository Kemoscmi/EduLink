import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Profesional } from '../models/profesional.model';
import { ApiResponse } from '../models/api-response.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfesionalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profesionales`;

  listar(): Observable<Profesional[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data?.data || [])
    );
  }

  obtenerPorId(id: number): Observable<ApiResponse<Profesional>> {
    return this.http.get<ApiResponse<Profesional>>(`${this.apiUrl}/${id}`);
  }

  crear(data: any): Observable<ApiResponse<Profesional>> {
    return this.http.post<ApiResponse<Profesional>>(this.apiUrl, data);
  }

  cambiarDisponibilidad(id: number): Observable<ApiResponse<Profesional>> {
    return this.http.patch<ApiResponse<Profesional>>(`${this.apiUrl}/${id}/disponibilidad`, {});
  }

  actualizar(id: number, data: any): Observable<ApiResponse<Profesional>> {
    return this.http.put<ApiResponse<Profesional>>(`${this.apiUrl}/${id}`, data);
  }
}
