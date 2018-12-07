import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Rutas
import { PAGES_ROUTES } from './pages.routes';
import { ADMINISTRACION_ROUTES } from '../modulos/administracion/administracion.routes';
import { CONTEXTO_ROUTES } from '../modulos/contexto/contexto.routes';
import { INDICADORES_ROUTES } from '../modulos/indicadores/indicadores.routes';
import { RIESGOS_ROUTES } from '../modulos/riesgos/riesgos.routes';
import { DOCUMENTOS_ROUTES } from '../modulos/documentos/documentos.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { AdministracionModule } from '../modulos/administracion/administracion.module';
import { ContextoModule } from '../modulos/contexto/contexto.module';
import { IndicadoresModule } from '../modulos/indicadores/indicadores.module';
import { RiesgosModule } from '../modulos/riesgos/riesgos.module';
import { PipesModule } from '../pipes/pipes.module';
import { DocumentosModule } from '../modulos/documentos/documentos.module';

// Componentes
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { IdentidadComponent } from './identidad/identidad.component';


@NgModule({
	declarations: [
		PagesComponent,
		DashboardComponent,
		ProfileComponent,
		IdentidadComponent
	],
	exports: [
		DashboardComponent
	],
	imports: [
		PipesModule,
		CommonModule,
		PAGES_ROUTES,
		ADMINISTRACION_ROUTES,
		CONTEXTO_ROUTES,
		INDICADORES_ROUTES,
		RIESGOS_ROUTES,
		DOCUMENTOS_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		AdministracionModule,
		ContextoModule,
		IndicadoresModule,
		RiesgosModule,
		DocumentosModule
	]
})

export class PagesModule { }
