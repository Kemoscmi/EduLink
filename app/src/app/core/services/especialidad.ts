import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Especialidad } from '../models/especialidad.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/especialidades`;

  listar() {
    return this.http.get<ApiResponse<Especialidad[]>>(this.apiUrl);
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Especialidad>>(`${this.apiUrl}/${id}/estado`, {});
  }
}
