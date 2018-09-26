import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Rutas
import { PANELFODA_ROUTES } from './panelfoda.routes';

// Modulos
import { ComponentModule } from '../components/component.module';

// Componentes
import { PanelfodaComponent } from './panelfoda.component';
import { AmenazasComponent } from './amenazas/amenazas.component';
import { OportunidadesComponent } from './oportunidades/oportunidades.component';
import { DebilidadesComponent } from './debilidades/debilidades.component';
import { FortalezasComponent } from './fortalezas/fortalezas.component';


@NgModule({
	imports: [
		CommonModule,
		PANELFODA_ROUTES,
		ComponentModule
	],
	declarations: [
		PanelfodaComponent,
		AmenazasComponent,
		OportunidadesComponent,
		DebilidadesComponent,
		FortalezasComponent
	]
})
export class PanelfodaModule { }
