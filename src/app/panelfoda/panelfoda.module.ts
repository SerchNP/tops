import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PANELFODA_ROUTES } from './panelfoda.routes';

// Modulos
import { ComponentModule } from '../components/component.module';

import { FiltraFodaPipe } from '../pipes/filtra-foda.pipe';

// Componentes
import { PanelfodaComponent } from './panelfoda.component';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { CardFodaComponent } from './card-foda/card-foda.component';


@NgModule({
	imports: [
		CommonModule,
		PANELFODA_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		FiltraFodaPipe,
		PanelfodaComponent,
		FodaComponent,
		FodaFormularioComponent,
		CardFodaComponent
	]
})
export class PanelfodaModule { }
