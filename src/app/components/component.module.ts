
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modulos
import { TreeModule } from 'angular-tree-component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng2TableModule } from 'ng2-table/ng2-table';

// Componentes
import { DataTableComponent } from './data-table/data-table.component';
import { ArbolComponent } from '../components/arbol/arbol.component';


@NgModule({
	declarations: [
		ArbolComponent,
		DataTableComponent
	],
	exports: [
		ArbolComponent,
		DataTableComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TreeModule.forRoot(),
		PaginationModule.forRoot(),
		Ng2TableModule
	]
})

export class ComponentModule { }
