import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { CONTEXTO_ROUTES } from './contexto.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material';
import { FiltraFodaPipe } from '../../pipes/filtra-foda.pipe';

// Componentes
import { ContextoComponent } from './contexto.component';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { CardFodaComponent } from './card-foda/card-foda.component';
import { AutorizaFodaComponent } from './foda/autoriza-foda.component';
import { RechazosFodaComponent } from './foda/rechazos-foda.component';


@NgModule({
	imports: [
		CommonModule,
		CONTEXTO_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule,
		MatExpansionModule,
		MatBadgeModule
	],
	declarations: [
		FiltraFodaPipe,
		ContextoComponent,
		FodaComponent,
		FodaFormularioComponent,
		CardFodaComponent,
		AutorizaFodaComponent,
		RechazosFodaComponent
	]
})
export class ContextoModule { }
