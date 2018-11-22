import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { CONTEXTO_ROUTES } from './contexto.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';
import { MatExpansionModule, MatCheckboxModule } from '@angular/material';
import { MatBadgeModule } from '@angular/material/badge';
import { PipesModule } from '../../pipes/pipes.module';

// Componentes
import { ContextoComponent } from './contexto.component';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { CardFodaComponent } from './card-foda/card-foda.component';
import { AutorizaFodaComponent } from './foda/autoriza-foda.component';
import { ListadoFodaComponent } from './foda/listado-foda.component';
import { DireccionComponent } from './direccion/direccion.component';
import { DireccionFormularioComponent } from './direccion/direccion-formulario.component';
import { LineaAccionComponent } from './direccion/linea-accion.component';
import { LineaAccionFormularioComponent } from './direccion/linea-accion-formulario.component';
import { EASProcesoComponent } from './ficha-proceso/eas-proceso.component';
import { EASProcesoFormularioComponent } from './ficha-proceso/eas-proceso-formulario.component';


@NgModule({
	imports: [
		CommonModule,
		CONTEXTO_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule,
		MatExpansionModule,
		MatBadgeModule,
		PipesModule,
		MatCheckboxModule
	],
	declarations: [
		ContextoComponent,
		FodaComponent,
		FodaFormularioComponent,
		CardFodaComponent,
		AutorizaFodaComponent,
		ListadoFodaComponent,
		DireccionComponent,
		DireccionFormularioComponent,
		LineaAccionComponent,
		LineaAccionFormularioComponent,
		EASProcesoComponent,
		EASProcesoFormularioComponent
	]
})
export class ContextoModule { }
