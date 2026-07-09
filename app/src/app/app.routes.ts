import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { ServicioCreatePage } from './pages/servicios/servicio-create-page/servicio-create-page';
import { ServicioEditPage } from './pages/servicios/servicio-edit-page/servicio-edit-page';
import { ServicioDetailPage } from './pages/servicios/servicio-detail-page/servicio-detail-page';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';
import { EspecialidadesList } from './pages/especialidades/especialidades-list/especialidades-list';
import { CitasList } from './pages/citas/citas-list/citas-list';
import { ProfesionalesList } from './pages/profesionales/profesionales-list/profesionales-list';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'servicios',
        component: ServiciosList,
      },
      {
        path: 'profesionales',
        component: ProfesionalesList,
      },
      {
        path: 'admin/usuarios',
        component: UsuariosList,
      },
      {
        path: 'admin/categorias',
        component: CategoriasList,
      },
      {
        path: 'admin/especialidades',
        component: EspecialidadesList,
      },
      {
        path: 'admin/servicios',
        component: ServiciosList,
      },
      {
        path: 'admin/servicios/nuevo',
        component: ServicioCreatePage,
      },
      {
        path: 'admin/servicios/:id/editar',
        component: ServicioEditPage,
      },
      {
        path: 'admin/servicios/:id',
        component: ServicioDetailPage,
      },
      {
        path: 'admin/citas',
        component: CitasList,
      },
      {
        path: 'admin/profesionales',
        component: ProfesionalesList,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];