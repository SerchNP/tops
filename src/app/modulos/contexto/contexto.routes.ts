import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard } from '../../services/services.index';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { AutorizaFodaComponent } from './foda/autoriza-foda.component';
import { ListadoFodaComponent } from './foda/listado-foda.component';
import { DireccionComponent } from './direccion/direccion.component';
import { DireccionFormularioComponent } from './direccion/direccion-formulario.component';
import { LineaAccionComponent } from './direccion/linea-accion.component';
import { LineaAccionFormularioComponent } from './direccion/linea-accion-formulario.component';
import { FichaProcesoComponent } from './ficha-proceso/ficha-proceso.component';


const ContextoRoutes: Routes = [
	{
		path: 'contexto',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{
				path: 'submenufoda',
				children: [
					{ path: 'foda', component: FodaComponent, data: {titulo: 'Cuestiones Externas e Internas', padre: 'FODA'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'fodamovs_form/:p/:d', component: FodaFormularioComponent, data: {titulo: 'Cuestiones Externas e Internas', padre: 'FODA'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'autorizafoda_form/:p/:d/:acc', component: AutorizaFodaComponent, data: {titulo: 'Revisión de FODA', padre: 'FODA'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'listado_foda', component: ListadoFodaComponent, data: {titulo: 'Listado de Cuestiones Externas e Internas', padre: 'FODA'} },
				]
			},
			{
				path: 'submenudirest',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'direccion', component: DireccionComponent, data: {titulo: 'Dirección Estratégica', padre: 'Contexto', opcion: 'Dirección Estratégica'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'direccion_form/:acc/:id/:aut', component: DireccionFormularioComponent, data: {titulo: 'Dirección Estratégica', padre: 'Contexto', opcion: 'Dirección Estratégica'} },
					{ path: 'lineas_accion', component: LineaAccionComponent, data: {titulo: 'Líneas de Acción', padre: 'Contexto'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'linea_form/:acc/:id/:aut', component: LineaAccionFormularioComponent, data: {titulo: 'Líneas de Acción', padre: 'Contexto', opcion: 'Dirección Estratégica'} },
				]
			},
			{
				path: 'submenufichaproc',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'eas_proceso', component: FichaProcesoComponent, data: {titulo: 'Entradas, Actividades y Salidas por Proceso', padre: 'Contexto'} }
				]
			}
		]
	}
];

export const CONTEXTO_ROUTES = RouterModule.forChild(ContextoRoutes);
