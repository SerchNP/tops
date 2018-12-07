import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard } from '../../services/services.index';
import { ReportesComponent } from './reportes/reportes.component';


const DocumentosRoutes: Routes = [
	{
		path: 'documentos',
		component: PagesComponent,
		canActivate: [LoginGuard],
		children: [
			{ path: 'reportes', component: ReportesComponent, data: {titulo: 'Reportes por Proceso', padre: 'Documentos'}},
		]
	}
];

export const DOCUMENTOS_ROUTES = RouterModule.forChild(DocumentosRoutes);
