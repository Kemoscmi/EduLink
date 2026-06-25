import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ServicioService } from '../../../core/services/servicio';
import { Servicio } from '../../../core/models/servicio.model';

@Component({
  selector: 'app-servicios-list',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css',
})
export class ServiciosList {
  private readonly servicioService = inject(ServicioService);

  servicios = signal<Servicio[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  search = signal('');

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();

    return this.servicios().filter((servicio) => {
      const nombre = servicio.nombre?.toLowerCase() ?? '';
      const descripcion = servicio.descripcion?.toLowerCase() ?? '';
      const categoria = servicio.categoria?.nombre?.toLowerCase() ?? '';

      return (
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        categoria.includes(texto)
      );
    });
  });

  totalServicios = computed(() => this.serviciosFiltrados().length);

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicioService.listar().subscribe({
      next: (servicios) => {
        this.servicios.set(servicios);
        this.loading.set(false);
        console.log('Servicios cargados:', servicios);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.search.set('');
  }
}