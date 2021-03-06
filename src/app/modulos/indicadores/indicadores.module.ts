import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { INDICADORES_ROUTES } from './indicadores.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';
import { PipesModule } from '../../pipes/pipes.module';

// Componentes
import { IndicadoresComponent } from './indicadores.component';
import { MatrizIndicadoresComponent } from './matriz_indicadores/matriz-indicadores.component';
import { IndicadorFormularioComponent } from './matriz_indicadores/indicador-formulario.component';
import { AutorizaIndicadoresComponent } from './matriz_indicadores/autoriza-indicadores.component';
import { IndicadorGraficasComponent } from './indicador-graficas/indicador-graficas.component';


@NgModule({
	imports: [
		PipesModule,
		CommonModule,
		INDICADORES_ROUTES,
		ComponentModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		IndicadoresComponent,
		MatrizIndicadoresComponent,
		IndicadorFormularioComponent,
		AutorizaIndicadoresComponent,
		IndicadorGraficasComponent
	]
})
export class IndicadoresModule { }
