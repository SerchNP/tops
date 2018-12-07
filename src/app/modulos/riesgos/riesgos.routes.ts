import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard } from '../../services/services.index';

// Modulos
import { RiesgosGestionComponent } from './riesgos-gestion/riesgos-gestion.component';
import { RiesgosGestionFormularioComponent } from './riesgos-gestion/riesgos-gestion-formulario.component';
import { AutorizaRiesgosGestionComponent } from './riesgos-gestion/autoriza-riesgos-gestion.component';
import { RiesgosOperativosComponent } from './riesgos-operativos/riesgos-operativos.component';
import { RiesgosOperativosFormularioComponent } from './riesgos-operativos/riesgos-operativos-formulario.component';
import { AutorizaRiesgosOperativosComponent } from './riesgos-operativos/autoriza-riesgos-operativos.component';
import { MatrizRiesgosComponent } from './matriz-riesgos/matriz-riesgos.component';
import { TratamientoRiesgoComponent } from './matriz-riesgos/tratamiento-riesgo.component';
import { MedicionRiesgoFormularioComponent } from './matriz-riesgos/medicion-riesgo-formulario.component';
import { AccionRiesgoFormularioComponent } from './matriz-riesgos/accion-riesgo-formulario.component';
import { MetodoEvaluacionComponent } from './matriz-riesgos/metodo-evaluacion.component';


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
			// tslint:disable-next-line:max-line-length
			{ path: 'autorizariesgoso_form/:acc', component: AutorizaRiesgosOperativosComponent, data: {titulo: 'Revisión de Riesgos Operativos', padre: 'Riesgos Operativos'}},
			{ path: 'matriz_riesgos', component: MatrizRiesgosComponent, data: {titulo: 'Matriz de Riesgos', padre: 'Riesgos'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'trata_riesgo_form/:acc/:id', component: TratamientoRiesgoComponent, data: {titulo: 'Acciones y Tratamiento del Riesgo', padre: 'Riesgos'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'medicion_riesgo_form/:acc/:id', component: MedicionRiesgoFormularioComponent, data: {titulo: 'Tratamiento del Riesgo', padre: 'Riesgos'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'accion_riesgo_form/:acc/:id', component: AccionRiesgoFormularioComponent, data: {titulo: 'Implementación de Acciones', padre: 'Riesgos'}},
			// tslint:disable-next-line:max-line-length
			{ path: 'metodo_evaluacion', component: MetodoEvaluacionComponent, data: {titulo: 'Método de Evaluación', padre: 'Evaluación de Riesgos'}}
		]
	}
];

export const RIESGOS_ROUTES = RouterModule.forChild(RiesgosRoutes);
