import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { INDICADORES_ROUTES } from './indicadores.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';

// Componentes
import { IndicadoresComponent } from './indicadores.component';
import { IndicadorAreaComponent } from './indicador_area/indicador-area.component';

@NgModule({
	imports: [
		CommonModule,
		INDICADORES_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		IndicadoresComponent,
		IndicadorAreaComponent
	]
})
export class IndicadoresModule { }
