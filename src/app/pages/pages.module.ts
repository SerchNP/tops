import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Rutas
import { PAGES_ROUTES } from './pages.routes';
import { PANELADM_ROUTES } from '../paneladm/paneladm.routes';
import { PANELFODA_ROUTES } from '../panelfoda/panelfoda.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { PaneladmModule } from '../paneladm/paneladm.module';
import { PanelfodaModule } from '../panelfoda/panelfoda.module';

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
		PANELFODA_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		PaneladmModule,
		PanelfodaModule
	]
})

export class PagesModule { }
