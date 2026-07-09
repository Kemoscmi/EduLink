import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Servicio } from '../models/servicio.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/servicios`;

  listar() {
    return this.http.get<ApiResponse<Servicio[]>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`);
  }

  crear(servicio: Partial<Servicio>) {
    return this.http.post<ApiResponse<Servicio>>(this.apiUrl, servicio);
  }

  actualizar(id: number, servicio: Partial<Servicio>) {
    return this.http.put<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, servicio);
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Servicio>>(`${this.apiUrl}/${id}/estado`, {});
  }
}
