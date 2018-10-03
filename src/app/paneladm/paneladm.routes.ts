import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFormularioComponent } from './usuarios/usuarios-formulario.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ProcesosFormularioComponent } from './procesos/procesos-formulario.component';
import { AreaProcesoFormularioComponent } from './area-proceso/area-proceso-formulario.component';
import { AreaProcesoComponent } from './area-proceso/area-proceso.component';
import { AreasComponent } from './areas/areas.component';
import { AreasFormularioComponent } from './areas/areas-formulario.component';
import { PuestosComponent } from './puestos/puestos.component';
import { PuestosFormularioComponent } from './puestos/puestos-formulario.component';
import { IdentidadComponent } from './identidad/identidad.component';
import { IdentidadFormularioComponent } from './identidad/identidad-formulario.component';

// Guards
import { LoginGuard } from '../services/services.index';



const paneladmRoutes: Routes = [
	{
		path: 'paneladm',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'areas', component: AreasComponent, data: {titulo: 'Catálogo de Áreas', padre: 'Administración', opcion: 'Áreas'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'areas_form/:acc/:id', component: AreasFormularioComponent, data: {titulo: 'Mantenimiento de Áreas', padre: 'Administración', opcion: 'Áreas'} },
			{
				path: 'submenuproc',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'procesos', component: ProcesosComponent, data: {titulo: 'Catálogo de Procesos', padre: 'Administración', opcion: 'Procesos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'procesos_form/:acc/:id', component: ProcesosFormularioComponent, data: {titulo: 'Mantenimiento de Procesos', padre: 'Administración', opcion: 'Procesos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'area_proceso', component: AreaProcesoComponent, data: {titulo: 'Asigna Área a Proceso', padre: 'Administración', opcion: 'Procesos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'area_proceso_form/:acc/:id', component: AreaProcesoFormularioComponent, data: {titulo: 'Asignación de Áreas a Procesos', padre: 'Administración', opcion: 'Procesos'} }
				]
			},
			{ path: 'puestos', component: PuestosComponent, data: {titulo: 'Catálogo de Puestos', padre: 'Administración', opcion: 'Puestos'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'puestos_form/:acc/:id', component: PuestosFormularioComponent, data: {titulo: 'Mantenimiento de Puestos', padre: 'Administración', opcion: 'Puestos'} },
			{
				path: 'submenuusu',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Catálogo de Usuarios', padre: 'Administración', opcion: 'Usuarios'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'usuarios_form/:acc/:id', component: UsuariosFormularioComponent, data: {titulo: 'Mantenimiento de Usuarios', padre: 'Administración', opcion: 'Usuarios'} }
				]
			},
			{
				path: 'submenuident',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_p', component: IdentidadComponent, data: {titulo: 'Catálogo de Políticas de Calidad', padre: 'Administración', opcion: 'Políticas de Calidad'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_a', component: IdentidadComponent, data: {titulo: 'Catálogo de Alcances', padre: 'Administración', opcion: 'Alcance'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_m', component: IdentidadComponent, data: {titulo: 'Catálogo de Misión', padre: 'Administración', opcion: 'Misión'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_v', component: IdentidadComponent, data: {titulo: 'Catálogo de Visión', padre: 'Administración', opcion: 'Visión'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_o', component: IdentidadComponent, data: {titulo: 'Catálogo de Objetivos de Calidad', padre: 'Administración', opcion: 'Objetivos de Calidad'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_n', component: IdentidadComponent, data: {titulo: 'Catálogo de Notas', padre: 'Administración', opcion: 'Notas'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_form/:tipo/:acc/:id', component: IdentidadFormularioComponent, data: {titulo: 'Mantenimiento de Catálogos de Identidad', padre: 'Administración', opcion: 'Identidad'} }
				]
			}
		]
	}
];

export const PANELADM_ROUTES = RouterModule.forChild(paneladmRoutes);
