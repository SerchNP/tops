import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard } from '../../services/services.index';
import { RiesgosGestionComponent } from './riesgos-gestion/riesgos-gestion.component';
import { RiesgosGestionFormularioComponent } from './riesgos-gestion/riesgos-gestion-formulario.component';



const RiesgosRoutes: Routes = [
	{
		path: 'riesgos',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'riesgo_gestion', component: RiesgosGestionComponent, data: {titulo: 'Riesgos de Gestión', padre: 'Riesgos'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'riesgo_gestion_form/:acc/:id/:aut', component: RiesgosGestionFormularioComponent, data: {titulo: 'Riesgos de Gestión', padre: 'Riesgos Gestión'}}
		]
	}
];

export const RIESGOS_ROUTES = RouterModule.forChild(RiesgosRoutes);
