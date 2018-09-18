import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ProcesosFormularioComponent } from './procesos/procesos-formulario.component';
import { AreasComponent } from './areas/areas.component';
import { PuestosComponent } from './puestos/puestos.component';

// Guards
import { LoginGuard } from '../services/services.index';


const catalogosRoutes: Routes = [
	{
		path: 'catalogos',
		component: PagesComponent,
		canActivate: [ LoginGuard ],
		children: [
			{ path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Catálogo de Usuarios', padre: 'Catálogos', opcion: 'Usuarios'} },
			{ path: 'procesos', component: ProcesosComponent, data: {titulo: 'Catálogo de Procesos', padre: 'Catálogos', opcion: 'Procesos'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'procesos_form/:acc/:id', component: ProcesosFormularioComponent, data: {titulo: 'Catálogo de Procesos', padre: 'Catálogos', opcion: 'Procesos'} },
			{ path: 'areas', component: AreasComponent, data: {titulo: 'Catálogo de Áreas', padre: 'Catálogos', opcion: 'Áreas'} },
			{ path: 'puestos', component: PuestosComponent, data: {titulo: 'Catálogo de Puestos', padre: 'Catálogos', opcion: 'Puestos'} }
		]
	}
];

export const CATALOGOS_ROUTES = RouterModule.forChild(catalogosRoutes);
