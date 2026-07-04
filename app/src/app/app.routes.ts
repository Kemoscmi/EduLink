import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { CategoriasList } from './pages/categorias/categorias-list/categorias-list';
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
        path: 'usuarios',
        component: UsuariosList,
      },
      {
        path: 'categorias',
        component: CategoriasList,
      },
      {
        path: 'citas',
        component: CitasList,
      },
      {
        path: 'profesionales',
        component: ProfesionalesList,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];