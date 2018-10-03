import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PANELFODA_ROUTES } from './panelfoda.routes';

// Modulos
import { ComponentModule } from '../components/component.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material';
import { FiltraFodaPipe } from '../pipes/filtra-foda.pipe';

// Componentes
import { PanelfodaComponent } from './panelfoda.component';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { CardFodaComponent } from './card-foda/card-foda.component';
import { AutfodaFormularioComponent } from './foda/autfoda-formulario.component';


@NgModule({
	imports: [
		CommonModule,
		PANELFODA_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule,
		MatExpansionModule,
		MatBadgeModule
	],
	declarations: [
		FiltraFodaPipe,
		PanelfodaComponent,
		FodaComponent,
		FodaFormularioComponent,
		CardFodaComponent,
		AutfodaFormularioComponent
	]
})
export class PanelfodaModule { }
