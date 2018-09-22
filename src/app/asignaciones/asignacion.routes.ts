import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../pages/pages.component';
import { AreaProcesoComponent } from './area-proceso/area-proceso.component';

// Guards
import { LoginGuard } from '../services/services.index';


const asignacionRoutes: Routes = [
	{
		path: 'asignaciones',
		component: PagesComponent,
		canActivate: [ LoginGuard ],
		children: [
			{ path: 'area_proceso', component: AreaProcesoComponent, data: {titulo: 'Asigna Áreas', padre: 'Asignaciones', opcion: 'Area Proceso'} }
		]
	}
];

export const ASIGNACIONES_ROUTES = RouterModule.forChild(asignacionRoutes);
