import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Usuario } from '../models/usuario.model';

export interface CredencialesLogin {
  email: string;
  password: string;
}

export interface DatosRegistro {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
}

export interface DatosPerfil {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
}

interface RespuestaLogin {
  usuario: Usuario;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;
  private readonly tokenKey = 'edulink_token';

  private readonly _token = signal<string | null>(this.leerTokenAlmacenado());
  private readonly _usuario = signal<Usuario | null>(null);
  private readonly _cargandoSesion = signal(false);
  private readonly _sesionInicializada = signal(false);
  private solicitudPerfilActual: Observable<Usuario | null> | null = null;

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly cargandoSesion = this._cargandoSesion.asReadonly();
  readonly sesionInicializada = this._sesionInicializada.asReadonly();

  readonly autenticado = computed(() => !!this._token() && !!this._usuario());
  readonly rol = computed<Usuario['role'] | null>(() => this._usuario()?.role ?? null);
  readonly esAdmin = computed(() => this.rol() === 'ADMIN');

  login(credenciales: CredencialesLogin): Observable<Usuario> {
    this._cargandoSesion.set(true);

    return this.http.post<ApiResponse<RespuestaLogin>>(`${this.apiUrl}/login`, credenciales).pipe(
      map((response) => response.data),
      tap(({ usuario, token }) => {
        this.guardarToken(token);
        this._usuario.set(usuario);
      }),
      map(({ usuario }) => usuario),
      catchError((error: HttpErrorResponse) => throwError(() => this.obtenerErrorAutenticacion(error))),
      finalize(() => this._cargandoSesion.set(false)),
    );
  }

  registrar(datos: DatosRegistro): Observable<Usuario> {
    return this.http.post<ApiResponse<Usuario>>(`${this.apiUrl}/register`, datos).pipe(
      map((response) => response.data),
      catchError((error: HttpErrorResponse) => throwError(() => this.obtenerErrorAutenticacion(error))),
    );
  }

  obtenerPerfil(): Observable<Usuario> {
    return this.http
      .get<ApiResponse<Usuario>>(`${this.apiUrl}/perfil`)
      .pipe(map((response) => response.data));
  }

  actualizarPerfil(datos: DatosPerfil): Observable<Usuario> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/perfil`, datos).pipe(
      map((response) => response.data),
      tap((usuario) => this._usuario.set(usuario)),
      catchError((error: HttpErrorResponse) => throwError(() => this.obtenerErrorAutenticacion(error))),
    );
  }

  inicializarSesion(): Observable<Usuario | null> {
    if (!this.leerTokenAlmacenado()) {
      this._sesionInicializada.set(true);
      return of(null);
    }

    return this.cargarPerfil();
  }

  cargarPerfil(): Observable<Usuario | null> {
    if (!this._token()) {
      this._sesionInicializada.set(true);
      return of(null);
    }

    if (this.solicitudPerfilActual) {
      return this.solicitudPerfilActual;
    }

    this._cargandoSesion.set(true);

    this.solicitudPerfilActual = this.obtenerPerfil().pipe(
      tap((usuario) => this._usuario.set(usuario)),
      catchError(() => {
        this.limpiarSesion();
        return of(null);
      }),
      finalize(() => {
        this._cargandoSesion.set(false);
        this._sesionInicializada.set(true);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.solicitudPerfilActual;
  }

  logout(redirigir = true): void {
    this.limpiarSesion();

    if (redirigir) {
      this.router.navigateByUrl('/login');
    }
  }

  tieneRol(rolesPermitidos: Usuario['role'][]): boolean {
    const rolActual = this.rol();
    return !!rolActual && rolesPermitidos.includes(rolActual);
  }

  obtenerToken(): string | null {
    return this._token();
  }

  private guardarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this._token.set(token);
  }

  private leerTokenAlmacenado(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token && token.trim().length > 0 ? token : null;
  }

  private limpiarSesion(): void {
    localStorage.removeItem(this.tokenKey);
    this._token.set(null);
    this._usuario.set(null);
    this.solicitudPerfilActual = null;
  }

  private obtenerErrorAutenticacion(error: HttpErrorResponse): Error {
    if (error.status === 0) {
      return new Error('No se pudo conectar con el servidor. Verifique su conexión de red.');
    }
    const mensaje = error.error?.message ?? 'No se pudo completar la operación. Intente nuevamente.';
    return new Error(mensaje);
  }
}
