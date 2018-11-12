import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { RIESGOS_ROUTES } from './riesgos.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';
import { PipesModule } from '../../pipes/pipes.module';
import { MatCheckboxModule, MatRadioModule } from '@angular/material';

// Componentes
import { RiesgosGestionComponent } from './riesgos-gestion/riesgos-gestion.component';
import { RiesgosGestionFormularioComponent } from './riesgos-gestion/riesgos-gestion-formulario.component';

@NgModule({
	imports: [
		PipesModule,
		CommonModule,
		RIESGOS_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule,
		MatCheckboxModule,
		MatRadioModule
	],
	declarations: [
		RiesgosGestionComponent,
		RiesgosGestionFormularioComponent
	],
	providers: []
})
export class RiesgosModule { }
