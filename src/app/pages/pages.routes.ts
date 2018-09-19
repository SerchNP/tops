import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IdentidadComponent } from './identidad/identidad.component';

// Guards
import { LoginGuard } from '../services/guards/login.guard';
import { TokenGuard } from '../services/guards/token.guard';


const pagesRoutes: Routes = [
	{
		path: '',
		component: PagesComponent,
		canActivate: [ LoginGuard ],
		children: [
			{ path: 'usuario/profile', component: ProfileComponent, data: {titulo: 'Perfil del Usuario', padre: 'Usuario', opcion: 'Perfil'} },
			{
				path: 'dashboard',
				component: DashboardComponent,
				canActivate: [ TokenGuard ],
				data: {titulo: 'Bienvenido'}
			},
			// tslint:disable-next-line:max-line-length
			{ path: 'identidad/politica', component: IdentidadComponent, data: {titulo: 'Política de Calidad', padre: 'Identidad', opcion: 'Política de Calidad'} },
			{ path: 'identidad/alcance', component: IdentidadComponent, data: {titulo: 'Alcance', padre: 'Identidad', opcion: 'Alcance'} },
			{ path: 'identidad/mision', component: IdentidadComponent, data: {titulo: 'Misión', padre: 'Identidad', opcion: 'Misión'} },
			{ path: 'identidad/vision', component: IdentidadComponent, data: {titulo: 'Visión', padre: 'Identidad', opcion: 'Visión'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'identidad/objetivos', component: IdentidadComponent, data: {titulo: 'Objetivos de Calidad', padre: 'Identidad', opcion: 'Objetivos de Calidad'} },
			{ path: 'identidad/notas', component: IdentidadComponent, data: {titulo: 'Notas', padre: 'Identidad', opcion: 'Notas'} },
			{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
		]
	}
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
