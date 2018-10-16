import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PANELCONTEXTO_ROUTES } from './panelcontexto.routes';

// Modulos
import { ComponentModule } from '../components/component.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material';
import { FiltraFodaPipe } from '../pipes/filtra-foda.pipe';

// Componentes
import { PanelContextoComponent } from './panelcontexto.component';
import { FodaComponent } from './foda/foda.component';
import { FodaFormularioComponent } from './foda/foda-formulario.component';
import { CardFodaComponent } from './card-foda/card-foda.component';
import { AutorizaFodaFormularioComponent } from './foda/autoriza-foda-formulario.component';
import { RechazosFodaFormularioComponent } from './foda/rechazos-foda-formulario.component';


@NgModule({
	imports: [
		CommonModule,
		PANELCONTEXTO_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule,
		MatExpansionModule,
		MatBadgeModule
	],
	declarations: [
		FiltraFodaPipe,
		PanelContextoComponent,
		FodaComponent,
		FodaFormularioComponent,
		CardFodaComponent,
		AutorizaFodaFormularioComponent,
		RechazosFodaFormularioComponent
	]
})
export class PanelContextoModule { }
