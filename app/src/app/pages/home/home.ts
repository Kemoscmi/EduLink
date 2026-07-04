import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ContentCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cards = signal<ContentCard[]>([
    {
      title: 'Servicios',
      description: 'Administración de los servicios educativos ofrecidos por los tutores.',
      icon: 'design_services',
    },
    {
      title: 'Categorías',
      description: 'Gestión de categorías para organizar los servicios.',
      icon: 'category',
    },
    {
      title: 'Usuarios',
      description: 'Administración de usuarios, clientes y tutores.',
      icon: 'group',
    },
    {
    title: 'Profesionales',
    description: 'Administración de los perfiles de los tutores, su información y disponibilidad.',
    icon: 'badge',
  },
  {
    title: 'Citas',
    description: 'Administración de las citas programadas entre estudiantes y tutores.',
    icon: 'event',
  },
  ]);
}