import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';

// Guards
import { LoginGuard } from '../services/services.index';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { AutfodaFormularioComponent } from './foda/autfoda-formulario.component';


const panelfodaRoutes: Routes = [
	{
		path: 'panelfoda',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'foda', component: FodaComponent, data: {titulo: 'FODA', padre: 'FODA'} },
			{ path: 'foda_form/:p/:d', component: FodaFormularioComponent, data: {titulo: 'FODA', padre: 'FODA'} },
			{ path: 'autfoda_form/:p/:d', component: AutfodaFormularioComponent, data: {titulo: 'Autoriza FODA', padre: 'FODA'} }
		]
	}
];

export const PANELFODA_ROUTES = RouterModule.forChild(panelfodaRoutes);
