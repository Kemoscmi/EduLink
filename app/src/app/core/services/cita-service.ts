import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Cita } from '../models/cita.model';
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

  listar() {
    return this.http.get<ApiPaginatedResponse<Cita>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`);
  }

  crear(cita: Partial<Cita>): Observable<ApiResponse<Cita>> {
    return this.http.post<ApiResponse<Cita>>(this.apiUrl, cita);
  }
}
