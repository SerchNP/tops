import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';

// Guards
import { LoginGuard } from '../services/services.index';
import { IndicadorAreaComponent } from './indicador_area/indicador-area.component';


const PanelIndicadoresRoutes: Routes = [
	{
		path: 'panelindicadores',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{
				path: 'indicador_area', component: IndicadorAreaComponent, data: {titulo: 'Indicadores en el Área', padre: 'Indicadores'}
			}
		]
	}
];

export const PANELINDICADORES_ROUTES = RouterModule.forChild(PanelIndicadoresRoutes);
