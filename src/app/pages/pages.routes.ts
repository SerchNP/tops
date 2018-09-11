import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Guards
import { LoginGuardGuard } from '../services/guards/login-guard.guard';

const pagesRoutes: Routes = [
	{
		path: '',
		component: PagesComponent,
		canActivate: [ LoginGuardGuard ],
		children: [
			{ path: 'usuario/profile', component: ProfileComponent, data: {titulo: 'Perfil del Usuario', padre: 'Usuario', opcion: 'Perfil'} },
			{ path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard'} },
			{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
		]
	}
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
