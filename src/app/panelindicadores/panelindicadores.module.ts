import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PANELINDICADORES_ROUTES } from './panelindicadores.routes';

// Modulos
import { ComponentModule } from '../components/component.module';

// Componentes
import { PanelIndicadoresComponent } from './panelindicadores.component';
import { IndicadorAreaComponent } from './indicador_area/indicador-area.component';

@NgModule({
	imports: [
		CommonModule,
		PANELINDICADORES_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		PanelIndicadoresComponent,
		IndicadorAreaComponent
	]
})
export class PanelIndicadoresModule { }
