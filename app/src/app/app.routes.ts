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
      // SERVICIOS
      {
        path: 'servicios',
        component: ServiciosList,
        title: 'Catálogo de Servicios',
      },
      {
        path: 'admin/servicios',
        component: ServiciosList,
        title: 'Catálogo de Servicios',
      },
      
      {
        path: 'admin/usuarios',
        component: UsuariosList,
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
      //CITAS
      {
        path: 'admin/citas',
        component: CitasList,
        title: 'Catálogo de Citas',
      },
      {
        path: 'admin/citas/nuevo',
        component: CitaCreate,
        title: 'Registrar Cita',
      },
      {
        path: 'citas/:id',
        component: CitaDetail,
        title: 'Detalle de Cita',
      },
      {
        path: 'admin/citas/:id',
        component: CitaDetail,
        title: 'Detalle de Cita',
      },
      //PROFESIONALES
      {
        path: 'profesionales',
        component: ProfesionalesList,
        title: 'Catálogo de Profesionales',
      },
      {
        path: 'admin/profesionales',
        component: ProfesionalesList,
        title: 'Catálogo de Profesionales',
      },
      {
        path: 'admin/profesionales/nuevo',
        component: ProfesionalCreatePage,
        title: 'Registrar Profesional',
      },
      {
        path: 'admin/profesionales/:id/editar',
        component: ProfesionalEditPage,
        title: 'Editar Profesional',
      },
      {
        path: 'profesionales/:id',
        component: ProfesionalDetail,
        title: 'Detalle de Profesional',
      },
      {
        path: 'admin/profesionales/:id',
        component: ProfesionalDetail,
        title: 'Detalle de Profesional',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];