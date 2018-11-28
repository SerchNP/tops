import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modulos
import { TreeModule } from 'angular-tree-component';
import { MatTableModule, MatSortModule, MatCheckboxModule,
		MatPaginatorModule, MatFormFieldModule, MatInputModule,
		MatProgressSpinnerModule, MatRadioModule} from '@angular/material';
import { PipesModule } from '../pipes/pipes.module';
import { MatBadgeModule } from '@angular/material/badge';
import { ChartsModule } from 'ng2-charts';

// Componentes
import { ArbolComponent } from '../components/arbol/arbol.component';
import { MatDataTableComponent } from './mat-data-table/mat-data-table.component';
import { MatDataTablePrivIntComponent } from './mat-data-table-privint/mat-data-table-privint.component';
import { CuestionesCheckComponent } from './cuestiones-check/cuestiones-check.component';
import { CuestionesRadioComponent } from './cuestiones-radio/cuestiones-radio.component';
import { GraficaMetodoEvaluacionComponent } from './grafica-metodo-evaluacion/grafica-metodo-evaluacion.component';
import { TablaMetodoEvaluacionComponent } from './tabla-metodo-evaluacion/tabla-metodo-evaluacion.component';


@NgModule({
	declarations: [
		ArbolComponent,
		MatDataTableComponent,
		MatDataTablePrivIntComponent,
		CuestionesCheckComponent,
		CuestionesRadioComponent,
		GraficaMetodoEvaluacionComponent,
		TablaMetodoEvaluacionComponent
	],
	exports: [
		ArbolComponent,
		MatDataTableComponent,
		MatDataTablePrivIntComponent,
		CuestionesCheckComponent,
		CuestionesRadioComponent,
		GraficaMetodoEvaluacionComponent,
		TablaMetodoEvaluacionComponent
	],
	imports: [
		PipesModule,
		RouterModule,
		MatBadgeModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TreeModule.forRoot(),
		MatTableModule,
		MatSortModule,
		MatCheckboxModule,
		MatRadioModule,
		MatPaginatorModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		ChartsModule
	]
})

export class ComponentModule { }
