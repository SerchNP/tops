import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
				data: {titulo: 'Dashboard'}
			},
			{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
		]
	}
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
