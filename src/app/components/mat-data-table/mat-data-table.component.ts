import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Derechos } from '../../interfaces/derechos.interface';
import { Router } from '@angular/router';


@Component({
	selector: 'app-mat-data-table',
	templateUrl: './mat-data-table.component.html',
	styleUrls: ['./mat-data-table.component.scss'],
	animations: [
	trigger('detailExpand', [
		state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
		state('expanded', style({height: '*'})),
		transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	]
})
export class MatDataTableComponent implements OnInit, AfterViewInit, OnChanges {

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	@Input() data: any [];
	@Input() columns = [];
	@Input() select;
	@Input() llave: string;
	@Input() derechos: Derechos;
	@Input() allowMultiSelect;
	@Input() ruta_add: any[];

	expandedElement;

	@Output() registro: EventEmitter<any> = new EventEmitter();

	dataSource: MatTableDataSource<any>;
	displayedColumns;
	length: number;
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];
	selection;

	constructor(private router: Router) {
	}

	ngOnChanges(changes) {
		if (changes['data']) {
			this.dataSource = new MatTableDataSource<any>(this.data);
			this.length = this.dataSource.data.length;
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
	}

	ngOnInit() {
		this.displayedColumns = this.columns.map(c => c.columnDef);
	}

	ngAfterViewInit() {
		if (this.select) {
			this.displayedColumns.splice(0, 0, 'select');
		}
		if (this.derechos.editar) {
			this.displayedColumns.push('editar');
		}
		if (this.derechos.cancelar) {
			this.displayedColumns.push('cancelar');
		}
		this.selection = new SelectionModel<{any}>(this.allowMultiSelect, []);
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		if (!this.dataSource) { return; }

		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	onRowClicked(row) {
		// console.log('Row clicked: ', row);
	}

	onButtonClicked(row, accion) {
		this.registro.emit({row, accion});
	}

	agregar() {
		this.router.navigate(this.ruta_add);
	}

}
