import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Profesional } from '../models/profesional.model';
import { ApiPaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfesionalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profesionales`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Profesional>>(this.apiUrl);
  }
}
