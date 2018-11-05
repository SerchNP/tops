import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Rutas
import { PAGES_ROUTES } from './pages.routes';
import { ADMINISTRACION_ROUTES } from '../modulos/administracion/administracion.routes';
import { CONTEXTO_ROUTES } from '../modulos/contexto/contexto.routes';
import { INDICADORES_ROUTES } from '../modulos/indicadores/indicadores.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { AdministracionModule } from '../modulos/administracion/administracion.module';
import { ContextoModule } from '../modulos/contexto/contexto.module';
import { IndicadoresModule } from '../modulos/indicadores/indicadores.module';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { IdentidadComponent } from './identidad/identidad.component';

// Pipes
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
		ADMINISTRACION_ROUTES,
		CONTEXTO_ROUTES,
		INDICADORES_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		AdministracionModule,
		ContextoModule,
		IndicadoresModule
	]
})

export class PagesModule { }
