import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { FiltraColumnsPipe } from '../../pipes/filtra-columns.pipe';
import { SelectionModel } from '@angular/cdk/collections';
import { Derechos } from '../../interfaces/derechos.interface';
import { Router } from '@angular/router';


@Component({
	selector: 'app-mat-data-table-privint',
	templateUrl: './mat-data-table-privint.component.html',
	styleUrls: ['./mat-data-table-privint.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
			state('expanded', style({height: '*'})),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	]
})

export class MatDataTablePrivIntComponent implements OnInit, AfterViewInit, OnChanges {

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	@Input() data: any [];
	@Input() columns = [];
	@Input() select;
	@Input() allowMultiSelect;
	@Input() ruta_add: any[];
	@Input() graficas: boolean;
	@Input() detalle: boolean;
	@Input() derechos: Derechos = {};

	expandedElement;

	@Output() registro: EventEmitter<any> = new EventEmitter();
	@Output() seleccionados: EventEmitter<any> = new EventEmitter();

	dataSource: MatTableDataSource<any>;
	displayedColumns;
	length: number;
	pageSize = 10;
	pageSizeOptions: number[] = [5, 10, 25, 100];
	selection;

	constructor(private router: Router) { }

	ngOnChanges(changes) {
		if (changes['data']) {
			this.dataSource = new MatTableDataSource<any>(this.data);
			this.length = this.dataSource.data.length;
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		} else if (changes['derechos']) {
			if (this.derechos.consultar) {
				this.displayedColumns.push('consultar');
			}
			if (this.derechos.administrar) {
				if (this.derechos.editar) {
					this.displayedColumns.push('editar');
				}
				if (this.derechos.cancelar) {
					this.displayedColumns.push('cancelar');
				}
			}
			if (this.derechos.autorizar) {
				this.displayedColumns.splice(0, 0, 'autorizar');
			}
		}
	}

	ngOnInit() {
		const columnasVisibles = new FiltraColumnsPipe().transform(this.columns, true);
		this.displayedColumns = columnasVisibles.map(c => c.columnDef);
	}

	ngAfterViewInit() {
		if (this.select) {
			this.displayedColumns.splice(0, 0, 'select');
		}
		if (this.detalle) {
			this.displayedColumns.push('detalle');
		}
		if (this.graficas) {
			this.displayedColumns.push('graficas');
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
			this.seleccionados.emit(this.selection.selected);
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	onCheckClicked() {
		this.seleccionados.emit(this.selection.selected);
	}

	onRowClicked(row) {
		this.seleccionados.emit(this.selection.selected);
	}

	onButtonClicked(row, accion) {
		this.registro.emit({row, accion});
	}

	agregar() {
		this.router.navigate(this.ruta_add);
	}

}
