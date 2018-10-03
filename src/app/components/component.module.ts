
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modulos
import { TreeModule } from 'angular-tree-component';
import { MatTableModule, MatSortModule, MatCheckboxModule,
		MatPaginatorModule, MatFormFieldModule, MatInputModule,
		MatProgressSpinnerModule } from '@angular/material';

// Componentes
import { DataTableComponent } from './data-table/data-table.component';
import { ArbolComponent } from '../components/arbol/arbol.component';
import { MatDataTableComponent } from './mat-data-table/mat-data-table.component';



@NgModule({
	declarations: [
		ArbolComponent,
		DataTableComponent,
		MatDataTableComponent
	],
	exports: [
		ArbolComponent,
		DataTableComponent,
		MatDataTableComponent
	],
	imports: [
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
