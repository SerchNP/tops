import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { INDICADORES_ROUTES } from './indicadores.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';

// Componentes
import { IndicadoresComponent } from './indicadores.component';
import { MatrizIndicadoresComponent } from './matriz_indicadores/matriz-indicadores.component';
import { IndicadorFormularioComponent } from './matriz_indicadores/indicador-formulario.component';
import { IndicadorGraficasComponent } from './indicador-graficas/indicador-graficas.component';

// Pipes
import { FiltraObjetivoPipe } from '../../pipes/filtra-objetivo.pipe';
import { FiltraProcesosPipe } from '../../pipes/filtra-procesos.pipe';


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
		MatrizIndicadoresComponent,
		IndicadorFormularioComponent,
		IndicadorGraficasComponent,
		FiltraObjetivoPipe,
		FiltraProcesosPipe
	]
})
export class IndicadoresModule { }
