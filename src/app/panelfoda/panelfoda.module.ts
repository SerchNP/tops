import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PANELFODA_ROUTES } from './panelfoda.routes';

// Modulos
import { ComponentModule } from '../components/component.module';

// Componentes
import { PanelfodaComponent } from './panelfoda.component';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { OportunidadesComponent } from './oportunidades/oportunidades.component';
import { OportunidadesFormularioComponent } from './oportunidades/oportunidades-formulario.component';
import { DebilidadesComponent } from './debilidades/debilidades.component';
import { DebilidadesFormularioComponent } from './debilidades/debilidades-formulario.component';
import { FortalezasComponent } from './fortalezas/fortalezas.component';
import { FortalezasFormularioComponent } from './fortalezas/fortalezas-formulario.component';


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
		FodaComponent,
		FodaFormularioComponent,
		OportunidadesComponent,
		OportunidadesFormularioComponent,
		DebilidadesComponent,
		DebilidadesFormularioComponent,
		FortalezasComponent,
		FortalezasFormularioComponent
	]
})
export class PanelfodaModule { }
