import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
		CATALOGOS_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		CatalogosModule
	]
})

export class PagesModule { }
