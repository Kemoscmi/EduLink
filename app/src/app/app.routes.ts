import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { LoginPage } from './pages/auth/login-page/login-page';
import { RegistroPage } from './pages/auth/registro-page/registro-page';
import { SinAutorizacion } from './pages/sin-autorizacion/sin-autorizacion';
import { PerfilPage } from './pages/perfil/perfil-page/perfil-page';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { ServicioCreatePage } from './pages/servicios/servicio-create-page/servicio-create-page';
import { ServicioEditPage } from './pages/servicios/servicio-edit-page/servicio-edit-page';
import { ServicioDetailPage } from './pages/servicios/servicio-detail-page/servicio-detail-page';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';
import { EspecialidadesList } from './pages/especialidades/especialidades-list/especialidades-list';
import { CitasList } from './pages/citas/citas-list/citas-list';
import { CitaDetail } from './pages/citas/cita-detail/cita-detail';
import { CitaCreate } from './pages/citas/cita-create/cita-create';
import { ProfesionalesList } from './pages/profesionales/profesionales-list/profesionales-list';
import { ProfesionalDetail } from './pages/profesionales/profesionales';
import { ProfesionalCreatePage } from './pages/profesionales/profesional-create-page/profesional-create-page';
import { ProfesionalEditPage } from './pages/profesionales/profesional-edit-page/profesional-edit-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
        title: 'Inicio',
      },
      // AUTENTICACIÓN
      {
        path: 'login',
        component: LoginPage,
        title: 'Iniciar sesión',
      },
      {
        path: 'registro',
        component: RegistroPage,
        title: 'Crear cuenta',
      },
      {
        path: 'sin-autorizacion',
        component: SinAutorizacion,
        title: 'Acceso no autorizado',
      },
      {
        path: 'perfil',
        component: PerfilPage,
        title: 'Mi perfil',
        canActivate: [authGuard],
      },
      // SERVICIOS (catálogo — requiere sesión iniciada)
      {
        path: 'servicios',
        component: ServiciosList,
        title: 'Catálogo de Servicios',
        canActivate: [authGuard],
      },
      // PROFESIONALES (catálogo — requiere sesión iniciada)
      {
        path: 'profesionales',
        component: ProfesionalesList,
        title: 'Catálogo de Profesionales',
        canActivate: [authGuard],
      },
      {
        path: 'profesionales/:id',
        component: ProfesionalDetail,
        title: 'Detalle de Profesional',
        canActivate: [authGuard],
      },
      // CITAS (cliente autenticado)
      {
        path: 'citas/:id',
        component: CitaDetail,
        title: 'Detalle de Cita',
        canActivate: [authGuard],
      },
      // ADMINISTRACIÓN — solo Administrador
      {
        path: 'admin/usuarios',
        component: UsuariosList,
        title: 'Gestión de Usuarios',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'admin/categorias',
        component: CategoriasList,
        title: 'Gestión de Categorías',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'admin/especialidades',
        component: EspecialidadesList,
        title: 'Gestión de Especialidades',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
      },
      // ADMINISTRACIÓN — Administrador y Profesional
      {
        path: 'admin/servicios',
        component: ServiciosList,
        title: 'Catálogo de Servicios',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/servicios/nuevo',
        component: ServicioCreatePage,
        title: 'Registrar Servicio',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/servicios/:id/editar',
        component: ServicioEditPage,
        title: 'Editar Servicio',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/servicios/:id',
        component: ServicioDetailPage,
        title: 'Detalle de Servicio',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/citas',
        component: CitasList,
        title: 'Catálogo de Citas',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/citas/nuevo',
        component: CitaCreate,
        title: 'Registrar Cita',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/citas/:id',
        component: CitaDetail,
        title: 'Detalle de Cita',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/profesionales',
        component: ProfesionalesList,
        title: 'Catálogo de Profesionales',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/profesionales/nuevo',
        component: ProfesionalCreatePage,
        title: 'Registrar Profesional',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/profesionales/:id/editar',
        component: ProfesionalEditPage,
        title: 'Editar Profesional',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
      {
        path: 'admin/profesionales/:id',
        component: ProfesionalDetail,
        title: 'Detalle de Profesional',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'TUTOR'] },
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];