import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';

// Guards
import { LoginGuard } from '../services/services.index';
import { AmenazasComponent } from './amenazas/amenazas.component';
import { OportunidadesComponent } from './oportunidades/oportunidades.component';
import { DebilidadesComponent } from './debilidades/debilidades.component';
import { FortalezasComponent } from './fortalezas/fortalezas.component';
import { AmenazasFormularioComponent } from './amenazas/amenazas-formulario.component';
import { FortalezasFormularioComponent } from './fortalezas/fortalezas-formulario.component';
import { DebilidadesFormularioComponent } from './debilidades/debilidades-formulario.component';
import { OportunidadesFormularioComponent } from './oportunidades/oportunidades-formulario.component';


const panelfodaRoutes: Routes = [
	{
		path: 'panelfoda',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'amenazas', component: AmenazasComponent, data: {titulo: 'Amenazas', padre: 'FODA', opcion: 'Amenazas'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'amenazas_form/:acc/:id/:t', component: AmenazasFormularioComponent, data: {titulo: 'Mantenimiento de FODA', padre: 'FODA', opcion: 'Amenazas'} },
			{ path: 'oportunidades', component: OportunidadesComponent, data: {titulo: 'Oportunidades', padre: 'FODA', opcion: 'Oportunidades'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'oportunidades_form/:acc/:id/:t', component: OportunidadesFormularioComponent, data: {titulo: 'Mantenimiento de FODA', padre: 'FODA', opcion: 'Oportunidades'} },
			{ path: 'debilidades', component: DebilidadesComponent, data: {titulo: 'Debilidades', padre: 'FODA', opcion: 'Debilidades'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'debilidades_form/:acc/:id/:t', component: DebilidadesFormularioComponent, data: {titulo: 'Mantenimiento de FODA', padre: 'FODA', opcion: 'Debilidades'} },
			{ path: 'fortalezas', component: FortalezasComponent, data: {titulo: 'Fortalezas', padre: 'FODA', opcion: 'Fortalezas'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'fortalezas_form/:acc/:id/:t', component: FortalezasFormularioComponent, data: {titulo: 'Mantenimiento de FODA', padre: 'FODA', opcion: 'Oportunidades'} }
		]
	}
];

export const PANELFODA_ROUTES = RouterModule.forChild(panelfodaRoutes);
