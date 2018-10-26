import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard } from '../../services/services.index';
import { IndicadorAreaComponent } from './indicador_area/indicador-area.component';
import { IndicadorAreaFormularioComponent } from './indicador_area/indicador-area-formulario.component';


const IndicadoresRoutes: Routes = [
	{
		path: 'indicadores',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'indicador_area', component: IndicadorAreaComponent, data: {titulo: 'Indicadores', padre: 'Indicadores'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'indicador_area_form/:acc/:id', component: IndicadorAreaFormularioComponent, data: {titulo: 'Registro Indicadores', padre: 'Indicadores'}}
		]
	}
];

export const INDICADORES_ROUTES = RouterModule.forChild(IndicadoresRoutes);
