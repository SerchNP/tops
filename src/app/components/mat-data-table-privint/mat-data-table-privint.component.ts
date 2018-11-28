import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, OnChanges,
		EventEmitter, SimpleChanges } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AccesoService } from '../../services/shared/acceso.service';
import { FiltraColumnsPipe } from '../../pipes/filtra-columns.pipe';
import { SelectionModel } from '@angular/cdk/collections';
import { Opciones } from '../../interfaces/opciones.interface';
import { Derechos } from '../../interfaces/derechos.interface';
import { Aviso } from '../../interfaces/aviso.interface';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { filter } from 'rxjs/operators';


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
	@Input() ruta_p: any[];
	@Input() ruta_r: any[];
	@Input() avisos: Aviso = {};
	@Input() opciones: Opciones = {};
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
	tipoUsuario = 'N';

	constructor(private router: Router,
				private _acceso: AccesoService) { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes['data']) {
			this.dataSource = new MatTableDataSource<any>(this.data);
			this.length = this.dataSource.data.length;
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
		if (this.displayedColumns !== undefined) {
			if (this.derechos.consultar) {
				if (this.displayedColumns.indexOf('consultar') === -1) {
					this.displayedColumns.push('consultar');
				}
			}
			if (this.derechos.administrar) {
				if (this.derechos.editar) {
					if (this.displayedColumns.indexOf('editar') === -1) {
						this.displayedColumns.push('editar');
					}
				}
				if (this.derechos.cancelar) {
					if (this.displayedColumns.indexOf('cancelar') === -1) {
						this.displayedColumns.push('cancelar');
					}
				}
			}
		}
	}

	ngOnInit() {
		this.tipoUsuario = this._acceso.tipoUsuario();
		const columnasVisibles = new FiltraColumnsPipe().transform(this.columns, true);
		this.displayedColumns = columnasVisibles.map(c => c.columnDef);
	}

	ngAfterViewInit() {
		if (this.select) {
			this.displayedColumns.splice(0, 0, 'select');
		}
		if (this.opciones.graficas) {
			this.displayedColumns.push('graficas');
		}
		if (this.opciones.detalle) {
			this.displayedColumns.push('detalle');
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
		let error = false;
		if (accion === 'C' || accion === 'E') {
			if ((this.tipoUsuario !== 'S' && this.tipoUsuario !== 'C') && row.autoriza === 2) {
				error = true;
				// tslint:disable-next-line:max-line-length
				swal('Error!!!', 'No es posible ' + ((accion === 'C') ? 'Cancelar' : 'Editar') + ', el registro ya se encuentra Pre-Autorizado', 'error');
			}
		}
		if (!error) {
			this.registro.emit({row, accion});
		}
	}

	agregar() {
		this.router.navigate(this.ruta_add);
	}

}
