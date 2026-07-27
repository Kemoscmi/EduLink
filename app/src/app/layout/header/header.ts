import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Usuario } from '../../core/models/usuario.model';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Usuario['role'][];
}

const ROLE_LABELS: Record<Usuario['role'], string> = {
  ADMIN: 'Administrador',
  TUTOR: 'Profesional',
  USER: 'Cliente',
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  publicMenu = input.required<MenuItem[]>();
  clienteMenu = input.required<MenuItem[]>();
  adminMaintenanceMenu = input.required<MenuItem[]>();
  adminManagementMenu = input.required<MenuItem[]>();
  currentUser = input<Usuario | null>(null);
  cartCount = input(0);
  isAdmin = input(false);
  canShowItem = input.required<(item: MenuItem) => boolean>();

  logoutUser = output<void>();

  roleLabel(role: Usuario['role']): string {
    return ROLE_LABELS[role];
  }
}
