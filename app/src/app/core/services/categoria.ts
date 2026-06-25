import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Categoria } from '../models/categoria.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  listar() {
    return this.http.get<ApiResponse<Categoria[]>>(this.apiUrl);
  }

  cambiarEstado(id: number) {
    return this.http.patch<ApiResponse<Categoria>>(`${this.apiUrl}/${id}/estado`, {});
  }
}