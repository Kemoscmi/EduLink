import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


interface ContentCard {
  title: string;
  description: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cards = signal<ContentCard[]>([
    {
      title: 'Servicios',
      description: 'Administración de los servicios educativos ofrecidos por los tutores.',
      icon: 'design_services',
      path: '/admin/servicios',
    },
    {
      title: 'Categorías',
      description: 'Gestión de categorías para organizar los servicios.',
      icon: 'category',
      path: '/admin/categorias',
    },
    {
      title: 'Especialidades',
      description: 'Clasificación de profesionales y servicios por área de conocimiento.',
      icon: 'workspace_premium',
      path: '/admin/especialidades',
    },
    {
      title: 'Usuarios',
      description: 'Administración de usuarios, clientes y tutores.',
      icon: 'group',
      path: '/admin/usuarios',
    },
    {
      title: 'Profesionales',
      description: 'Administración de los perfiles de los tutores, su información y disponibilidad.',
      icon: 'badge',
      path: '/admin/profesionales',
    },
    {
      title: 'Citas',
      description: 'Administración de las citas programadas entre estudiantes y tutores.',
      icon: 'event',
      path: '/admin/citas',
    },
  ]);
}
