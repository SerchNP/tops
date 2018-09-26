import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { AmenazasFormularioComponent } from './amenazas/amenazas-formulario.component';


@NgModule({
	imports: [
		CommonModule,
		PANELFODA_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		PanelfodaComponent,
		AmenazasComponent,
		OportunidadesComponent,
		DebilidadesComponent,
		FortalezasComponent,
		AmenazasFormularioComponent
	]
})
export class PanelfodaModule { }
