import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';

// Guards
import { LoginGuard } from '../services/services.index';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { AutorizaFodaFormularioComponent } from './foda/autoriza-foda-formulario.component';
import { RechazosFodaFormularioComponent } from './foda/rechazos-foda-formulario.component';


const PanelContextoRoutes: Routes = [
	{
		path: 'panelcontexto',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{
				path: 'panelfoda',
				children: [
					{ path: 'foda', component: FodaComponent, data: {titulo: 'FODA', padre: 'FODA'} },
					{ path: 'foda_form/:p/:d', component: FodaFormularioComponent, data: {titulo: 'FODA', padre: 'FODA'} },
					{ path: 'autorizafoda_form/:p/:d', component: AutorizaFodaFormularioComponent, data: {titulo: 'Autoriza FODA', padre: 'FODA'} },
					{ path: 'rechazosfoda_form/:p/:d', component: RechazosFodaFormularioComponent, data: {titulo: 'Rechazos FODA', padre: 'FODA'} }
				]
			}
		]
	}
];

export const PANELCONTEXTO_ROUTES = RouterModule.forChild(PanelContextoRoutes);
