import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/servicios`;

  listar() {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  crear(servicio: Partial<Servicio>) {
    return this.http.post<Servicio>(this.apiUrl, servicio);
  }

  actualizar(id: number, servicio: Partial<Servicio>) {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio);
  }

  cambiarEstado(id: number) {
    return this.http.patch<Servicio>(`${this.apiUrl}/${id}/estado`, {});
  }
}