import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Usuario } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  listar() {
    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl);
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}/estado`, {});
  }

  cambiarRol(id: number, role: Usuario['role']) {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}/rol`, { role });
  }
}