import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard } from '../../services/services.index';
import { MatrizIndicadoresComponent } from './matriz_indicadores/matriz-indicadores.component';
import { IndicadorFormularioComponent } from './matriz_indicadores/indicador-formulario.component';
import { AutorizaIndicadoresComponent } from './matriz_indicadores/autoriza-indicadores.component';
import { IndicadorGraficasComponent } from './indicador-graficas/indicador-graficas.component';


const IndicadoresRoutes: Routes = [
	{
		path: 'indicadores',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'matriz_indicadores', component: MatrizIndicadoresComponent, data: {titulo: 'Matriz de Indicadores', padre: 'Indicadores'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'indicador_form/:acc/:id/:aut/:o', component: IndicadorFormularioComponent, data: {titulo: 'Indicadores', padre: 'Indicadores'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'autorizaindica_form/:acc', component: AutorizaIndicadoresComponent, data: {titulo: 'Revisión de Indicadores', padre: 'Indicadores'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'indicador_graficas/:id', component: IndicadorGraficasComponent, data: {titulo: 'Mediciones del Indicador', padre: 'Indicadores'}}
		]
	}
];

export const INDICADORES_ROUTES = RouterModule.forChild(IndicadoresRoutes);
