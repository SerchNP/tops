import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PAGES_ROUTES } from './pages.routes';
import { CATALOGOS_ROUTES } from '../catalogos/catalogo.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { CatalogosModule } from '../catalogos/catalogos.module';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
	declarations: [
		PagesComponent,
		DashboardComponent,
		ProfileComponent
	],
	exports: [
		DashboardComponent
	],
	imports: [
		PAGES_ROUTES,
		CATALOGOS_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		CatalogosModule
	]
})

export class PagesModule { }
