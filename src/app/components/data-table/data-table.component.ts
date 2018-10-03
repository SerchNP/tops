import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Derechos } from '../../interfaces/derechos.interface';

@Component({
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styles: []
})
export class DataTableComponent implements OnInit {

	@ViewChild ('filtro') filtro: ElementRef;

	@Input() data: any[] = [];
	@Input() columns: Array<any> = [];
	@Input() length = 0;
	@Input() llave: string;
	@Input() derechos: Derechos;
	@Input() ruta_add: any[];
	@Input() otra_accion1: boolean;
	@Input() ruta_acc1: any[];
	@Input() otra_accion2: boolean;
	@Input() ruta_acc2: any[];

	@Output() registro: EventEmitter<any> = new EventEmitter();

	public page = 1;
	public itemsPerPage = 10;
	public maxSize = 5;
	public numPages = 1;
	public rows: Array<any> = [];
	public config: any = {
		paging: true,
		sorting: {columns: this.columns},
		filtering: {filterString: ''},
		className: ['table-striped', 'table-bordered', 'table-hover', 'table-responsive']
	};

	constructor(private router: Router) {
	}

	ngOnInit() {
	}

	agregar() {
		this.router.navigate(this.ruta_add);
	}

	public changePage(page: any, data: Array<any> = this.data): Array<any> {
		const start = (page.page - 1) * page.itemsPerPage;
		const end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
		return data.slice(start, end);
	}

	public changeSort(data: any, config: any): any {
		if (!config.sorting) {
			return data;
		}

		const cols = this.config.sorting.columns || [];
		let colName: string = void 0;
		let sort: string = void 0;

		for (let i = 0; i < cols.length; i++) {
			if (cols[i].sort !== '' && cols[i].sort !== false) {
				colName = cols[i].name;
				sort = cols[i].sort;
			}
		}

		if (!colName) {
			return data;
		}

		// simple sorting
		return data.sort((previous: any, current: any) => {
			if (previous[colName] > current[colName]) {
				return sort === 'desc' ? -1 : 1;
			} else if (previous[colName] < current[colName]) {
				return sort === 'asc' ? -1 : 1;
			}
			return 0;
		});
	}

	public changeFilter(data: any, config: any): any {
		let filteredData: Array<any> = data;
		this.columns.forEach((column: any) => {
			let flag = false;
			if (column.filtering) {
				filteredData = filteredData.filter((item: any) => {
					if (item[column.name]) {
						if (item[column.name].toString().toLowerCase().match(column.filtering.filterString.toLowerCase())) {
							flag = true;
						}
					}
					if (flag) {
						return item[column.name].toString().toLowerCase().match(column.filtering.filterString.toLowerCase());
					}
			});
			}
		});

		if (!config.filtering) {
			return filteredData;
		}

		if (config.filtering.columnName) {
			return filteredData.filter((item: any) =>
				item[config.filtering.columnName].toString().toLowerCase().match(this.config.filtering.filterString.toLowerCase()));
		}

		const tempArray: Array<any> = [];
		filteredData.forEach((item: any) => {
			let flag = false;
			this.columns.forEach((column: any) => {
				if (item[column.name]) {
					if (item[column.name].toString().toLowerCase().match(this.config.filtering.filterString.toLowerCase())) {
						flag = true;
					}
				}
			});
			if (flag) {
				tempArray.push(item);
			}
		});
		filteredData = tempArray;

		return filteredData;
	}

	public onChangeTable(config: any, page: any = {page: this.page, itemsPerPage: this.itemsPerPage}): any {
		if (this.derechos.editar) {
			this.columns.push({title: '', name: 'action_e', sort: false, filter: false});
			for (let i = 0; i < this.data.length; i ++) {
				this.data [i] ['action_e'] = `<a><span class='editar' title='Editar registro'><i class='far fa-edit'></i></span></a>`;
			}
		}
		if (this.derechos.cancelar) {
			this.columns.push({title: '', name: 'action_c', sort: false, filter: false});
			for (let i = 0; i < this.data.length; i ++) {
				this.data [i] ['action_c'] = `<a><span class='cancelar' title='Cancelar registro'><i class='far fa-trash-alt'></i></span></a>`;
			}
		}
		if (config.filtering) {
			Object.assign(this.config.filtering, config.filtering);
		}

		if (config.sorting) {
			Object.assign(this.config.sorting, config.sorting);
		}
		const filteredData = this.changeFilter(this.data, this.config);
		const sortedData = this.changeSort(filteredData, this.config);
		this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
		this.length = sortedData.length;
	}

	public onCellClick(data: any): any {
		this.registro.emit(data);
	}

	clearFilter() {
		this.filtro.nativeElement.value = '';
		this.config.filtering = {filterString: ''};
		this.onChangeTable(this.config);
		// this.changeFilter(this.data, this.config);
	}

}
