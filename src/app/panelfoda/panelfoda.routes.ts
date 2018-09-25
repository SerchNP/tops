import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';

// Guards
import { LoginGuard } from '../services/services.index';
import { AmenazasComponent } from './amenazas/amenazas.component';
import { OportunidadesComponent } from './oportunidades/oportunidades.component';
import { DebilidadesComponent } from './debilidades/debilidades.component';
import { FortalezasComponent } from './fortalezas/fortalezas.component';


const panelfodaRoutes: Routes = [
	{
		path: 'panelfoda',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'amenazas', component: AmenazasComponent, data: {titulo: 'Amenazas', padre: 'FODA', opcion: 'Amenazas'} },
			{ path: 'oportunidades', component: OportunidadesComponent, data: {titulo: 'Oportunidades', padre: 'FODA', opcion: 'Oportunidades'} },
			{ path: 'debilidades', component: DebilidadesComponent, data: {titulo: 'Debilidades', padre: 'FODA', opcion: 'DEbilidades'} },
			{ path: 'fortalezas', component: FortalezasComponent, data: {titulo: 'Fortalezas', padre: 'FODA', opcion: 'Fortalezas'} }
		]
	}
];

export const PANELFODA_ROUTES = RouterModule.forChild(panelfodaRoutes);
