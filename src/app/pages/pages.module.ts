import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Rutas
import { PAGES_ROUTES } from './pages.routes';
import { PANELADM_ROUTES } from '../paneladm/paneladm.routes';
import { PANELCONTEXTO_ROUTES } from '../panelcontexto/panelcontexto.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { PaneladmModule } from '../paneladm/paneladm.module';
import { PanelContextoModule } from '../panelcontexto/panelcontexto.module';
import { PanelIndicadoresModule } from '../panelindicadores/panelindicadores.module';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { IdentidadComponent } from './identidad/identidad.component';
import { GroupByPipe } from '../pipes/group-by.pipe';

@NgModule({
	declarations: [
		PagesComponent,
		DashboardComponent,
		ProfileComponent,
		IdentidadComponent,
		GroupByPipe
	],
	exports: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		PAGES_ROUTES,
		PANELADM_ROUTES,
		PANELCONTEXTO_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		PaneladmModule,
		PanelContextoModule,
		PanelIndicadoresModule
	]
})

export class PagesModule { }
