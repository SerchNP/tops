import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';

// Guards
import { LoginGuard } from '../services/services.index';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { AutorizaFodaComponent } from './foda/autoriza-foda.component';
import { RechazosFodaComponent } from './foda/rechazos-foda.component';


const PanelContextoRoutes: Routes = [
	{
		path: 'panelcontexto',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{
				path: 'panelfoda',
				children: [
					{ path: 'foda', component: FodaComponent, data: {titulo: 'FODA', padre: 'foda'} },
					{ path: 'fodamovs_form/:p/:d', component: FodaFormularioComponent, data: {titulo: 'FODA', padre: 'foda'} },
					{ path: 'autorizafoda_form/:p/:d', component: AutorizaFodaComponent, data: {titulo: 'Autoriza FODA', padre: 'foda'} },
					{ path: 'rechazosfoda_form/:p/:d', component: RechazosFodaComponent, data: {titulo: 'Rechazos FODA', padre: 'foda'} }
				]
			}
		]
	}
];

export const PANELCONTEXTO_ROUTES = RouterModule.forChild(PanelContextoRoutes);
