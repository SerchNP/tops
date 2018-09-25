import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFormularioComponent } from './usuarios/usuarios-formulario.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ProcesosFormularioComponent } from './procesos/procesos-formulario.component';
import { AreasComponent } from './areas/areas.component';
import { PuestosComponent } from './puestos/puestos.component';

// Guards
import { LoginGuard } from '../services/services.index';


const paneladmRoutes: Routes = [
	{
		path: 'paneladm',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'areas', component: AreasComponent, data: {titulo: 'Catálogo de Áreas', padre: 'Administración', opcion: 'Áreas'} },
			{
				path: 'submenuproc',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'procesos', component: ProcesosComponent, data: {titulo: 'Catálogo de Procesos', padre: 'Administración', opcion: 'Procesos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'procesos_form/:acc/:id', component: ProcesosFormularioComponent, data: {titulo: 'Mantenimiento de Procesos', padre: 'Administración', opcion: 'Procesos'} }
				]
			},
			{ path: 'puestos', component: PuestosComponent, data: {titulo: 'Catálogo de Puestos', padre: 'Administración', opcion: 'Puestos'} },
			{
				path: 'submenuusu',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Catálogo de Usuarios', padre: 'Administración', opcion: 'Usuarios'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'usuarios_form/:acc/:id', component: UsuariosFormularioComponent, data: {titulo: 'Mantenimiento de Usuarios', padre: 'Administración', opcion: 'Usuarios'} }
				]
			}
		]
	}
];

export const PANELADM_ROUTES = RouterModule.forChild(paneladmRoutes);
