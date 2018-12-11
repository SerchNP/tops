import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { RIESGOS_ROUTES } from './riesgos.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';
import { PipesModule } from '../../pipes/pipes.module';
import { MatExpansionModule, MatCheckboxModule, MatRadioModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts';

// Componentes
import { RiesgosComponent } from './riesgos.component';
import { RiesgosGestionComponent } from './riesgos-gestion/riesgos-gestion.component';
import { RiesgosGestionFormularioComponent } from './riesgos-gestion/riesgos-gestion-formulario.component';
import { AutorizaRiesgosGestionComponent } from './riesgos-gestion/autoriza-riesgos-gestion.component';
import { RiesgosOperativosComponent } from './riesgos-operativos/riesgos-operativos.component';
import { RiesgosOperativosFormularioComponent } from './riesgos-operativos/riesgos-operativos-formulario.component';
import { AutorizaRiesgosOperativosComponent } from './riesgos-operativos/autoriza-riesgos-operativos.component';
import { MatrizRiesgosComponent } from './matriz-riesgos/matriz-riesgos.component';
import { TratamientoRiesgoComponent } from './matriz-riesgos/tratamiento-riesgo.component';
import { MedicionRiesgoFormularioComponent } from './matriz-riesgos/medicion-riesgo-formulario.component';
import { AccionRiesgoFormularioComponent } from './matriz-riesgos/accion-riesgo-formulario.component';
import { MetodoEvaluacionComponent } from './matriz-riesgos/metodo-evaluacion.component';


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
		MatRadioModule,
		ChartsModule
	],
	declarations: [
		RiesgosComponent,
		RiesgosGestionComponent,
		RiesgosGestionFormularioComponent,
		AutorizaRiesgosGestionComponent,
		RiesgosOperativosComponent,
		RiesgosOperativosFormularioComponent,
		AutorizaRiesgosOperativosComponent,
		MatrizRiesgosComponent,
		TratamientoRiesgoComponent,
		MedicionRiesgoFormularioComponent,
		AccionRiesgoFormularioComponent,
		MetodoEvaluacionComponent
	],
	providers: []
})
export class RiesgosModule { }
