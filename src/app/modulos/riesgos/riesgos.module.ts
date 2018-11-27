import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { RIESGOS_ROUTES } from './riesgos.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';
import { PipesModule } from '../../pipes/pipes.module';
import { MatExpansionModule, MatCheckboxModule, MatRadioModule } from '@angular/material';

// Componentes
import { RiesgosGestionComponent } from './riesgos-gestion/riesgos-gestion.component';
import { RiesgosGestionFormularioComponent } from './riesgos-gestion/riesgos-gestion-formulario.component';
import { AutorizaRiesgosGestionComponent } from './riesgos-gestion/autoriza-riesgos-gestion.component';
import { RiesgosOperativosComponent } from './riesgos-operativos/riesgos-operativos.component';
import { RiesgosOperativosFormularioComponent } from './riesgos-operativos/riesgos-operativos-formulario.component';
import { MatrizRiesgosComponent } from './matriz-riesgos/matriz-riesgos.component';
import { TratamientoRiesgoComponent } from './matriz-riesgos/tratamiento-riesgo.component';


@NgModule({
	imports: [
		PipesModule,
		CommonModule,
		RIESGOS_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule,
		MatExpansionModule,
		MatCheckboxModule,
		MatRadioModule
	],
	declarations: [
		RiesgosGestionComponent,
		RiesgosGestionFormularioComponent,
		AutorizaRiesgosGestionComponent,
		RiesgosOperativosComponent,
		RiesgosOperativosFormularioComponent,
		MatrizRiesgosComponent,
		TratamientoRiesgoComponent
	],
	providers: []
})
export class RiesgosModule { }
