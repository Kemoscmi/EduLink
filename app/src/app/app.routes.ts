import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';
import { CitasList } from './pages/citas/citas-list/citas-list';
import { CitaDetail } from './pages/citas/cita-detail/cita-detail';
import { ProfesionalesList } from './pages/profesionales/profesionales-list/profesionales-list';
import { ProfesionalDetail } from './pages/profesionales/profesionales';

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
        path: 'usuarios',
        component: UsuariosList,
      },
      {
        path: 'admin/usuarios',
        component: UsuariosList,
      },
      {
        path: 'categorias',
        component: CategoriasList,
      },
      {
        path: 'admin/categorias',
        component: CategoriasList,
      },
      {
        path: 'citas',
        component: CitasList,
        title: 'Catálogo de Citas',
      },
      {
        path: 'citas/:id',
        component: CitaDetail,
        title: 'Detalle de Cita',
      },
      {
        path: 'admin/citas',
        component: CitasList,
        title: 'Catálogo de Citas',
      },
      {
        path: 'admin/citas/:id',
        component: CitaDetail,
        title: 'Detalle de Cita',
      },
      {
        path: 'profesionales',
        component: ProfesionalesList,
        title: 'Catálogo de Profesionales',
      },
      {
        path: 'profesionales/:id',
        component: ProfesionalDetail,
        title: 'Detalle de Profesional',
      },
      {
        path: 'admin/profesionales',
        component: ProfesionalesList,
        title: 'Catálogo de Profesionales',
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