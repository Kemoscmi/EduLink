import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Usuario } from '../../core/models/usuario.model';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Usuario['role'][];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly authService = inject(AuthenticationService);

  currentUser = this.authService.usuario;
  isAdmin = this.authService.esAdmin;

  publicMenu = signal<MenuItem[]>([{ label: 'Inicio', path: '/', icon: 'home' }]);

  clienteMenu = signal<MenuItem[]>([
    { label: 'Servicios', path: '/servicios', icon: 'school' },
    { label: 'Profesionales', path: '/profesionales', icon: 'person_search' },
    { label: 'Mis citas', path: '/mis-citas', icon: 'event_note', roles: ['USER'] },
    { label: 'Mi agenda', path: '/agenda', icon: 'calendar_month', roles: ['TUTOR'] },
    { label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart', roles: ['TUTOR'] },
  ]);

  adminMaintenanceMenu = signal<MenuItem[]>([
    { label: 'Servicios', path: '/admin/servicios', icon: 'design_services' },
    { label: 'Categorías', path: '/admin/categorias', icon: 'category' },
    { label: 'Especialidades', path: '/admin/especialidades', icon: 'workspace_premium' },
    { label: 'Profesionales', path: '/admin/profesionales', icon: 'badge' },
  ]);

  adminManagementMenu = signal<MenuItem[]>([
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'group' },
    { label: 'Citas', path: '/admin/citas', icon: 'event' },
    { label: 'Agenda', path: '/agenda', icon: 'calendar_month' },
    { label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart' },
  ]);

  canShowItem(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.currentUser();
    return !!user && item.roles.includes(user.role);
  }

  logout(): void {
    this.authService.logout();
  }
}
