import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

type Role = 'CLIENTE' | 'ADMIN';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

interface User {
  nombre: string;
  role: Role;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentUser = signal<User | null>(null);

  publicMenu = signal<MenuItem[]>([
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Servicios', path: '/servicios', icon: 'school' },
    { label: 'Profesionales', path: '/profesionales', icon: 'person_search' },
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
    { label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart' },
  ]);

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  canShowItem(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.currentUser();
    return !!user && item.roles.includes(user.role);
  }

  loginAsClient(): void {
    this.currentUser.set({ nombre: 'Cliente Demo', role: 'CLIENTE' });
  }

  loginAsAdmin(): void {
    this.currentUser.set({ nombre: 'Admin Demo', role: 'ADMIN' });
  }

  logout(): void {
    this.currentUser.set(null);
  }
}