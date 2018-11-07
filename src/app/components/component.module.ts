import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modulos
import { TreeModule } from 'angular-tree-component';
import { MatTableModule, MatSortModule, MatCheckboxModule,
		MatPaginatorModule, MatFormFieldModule, MatInputModule,
		MatProgressSpinnerModule } from '@angular/material';
import { PipesModule } from '../pipes/pipes.module';
import { MatBadgeModule } from '@angular/material/badge';

// Componentes
import { ArbolComponent } from '../components/arbol/arbol.component';
import { MatDataTableComponent } from './mat-data-table/mat-data-table.component';
import { MatDataTablePrivIntComponent } from './mat-data-table-privint/mat-data-table-privint.component';


@NgModule({
	declarations: [
		ArbolComponent,
		MatDataTableComponent,
		MatDataTablePrivIntComponent
	],
	exports: [
		ArbolComponent,
		MatDataTableComponent,
		MatDataTablePrivIntComponent
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
		MatPaginatorModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule
	]
})

export class ComponentModule { }
