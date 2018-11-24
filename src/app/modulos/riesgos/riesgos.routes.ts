import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard } from '../../services/services.index';
import { RiesgosGestionComponent } from './riesgos-gestion/riesgos-gestion.component';
import { RiesgosGestionFormularioComponent } from './riesgos-gestion/riesgos-gestion-formulario.component';
import { AutorizaRiesgosGestionComponent } from './riesgos-gestion/autoriza-riesgos-gestion.component';
import { RiesgosOperativosComponent } from './riesgos-operativos/riesgos-operativos.component';
import { RiesgosOperativosFormularioComponent } from './riesgos-operativos/riesgos-operativos-formulario.component';


const RiesgosRoutes: Routes = [
	{
		path: 'riesgos',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'riesgo_gestion', component: RiesgosGestionComponent, data: {titulo: 'Riesgos de Gestión', padre: 'Riesgos'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'riesgo_gestion_form/:acc/:id/:aut/:o', component: RiesgosGestionFormularioComponent, data: {titulo: 'Gestión de Riesgos', padre: 'Riesgos Gestión'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'autorizariesgosg_form/:acc', component: AutorizaRiesgosGestionComponent, data: {titulo: 'Revisión de Riesgos de Gestión', padre: 'Riesgos Gestión'}},
			{ path: 'riesgo_operativo', component: RiesgosOperativosComponent, data: {titulo: 'Riesgos Operativos', padre: 'Riesgos'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'riesgo_operativo_form/:acc/:id/:aut/:o', component: RiesgosOperativosFormularioComponent, data: {titulo: 'Gestión de Riesgos', padre: 'Riesgos'}},
		]
	}
];

export const RIESGOS_ROUTES = RouterModule.forChild(RiesgosRoutes);
