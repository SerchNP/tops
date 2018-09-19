import { Component, OnInit, ViewChild } from '@angular/core';
import { PuestosService, AccesoService } from '../../services/services.index';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
	selector: 'app-puestos',
	templateUrl: './puestos.component.html',
	styles: []
})

export class PuestosComponent implements OnInit {

	@ViewChild('dtpuestos') dataTable: DataTableComponent;

	jsonData: any;
	data: any[] = [];
	cargando = false;
	llave = 'puesto';

	columns: Array<any> = [
		{title: 'Puesto', name: 'puesto', columnName: 'puesto',
			filtering: {filterString: '', placeholder: 'Filtra puesto'}},
		{title: 'Predecesor', name: 'predecesor', columnName: 'predecesor',
			filtering: {filterString: '', placeholder: 'Filtra predecesor'}},
		{title: 'Descripción', name: 'puesto_desc', sort: 'asc', columnName: 'puesto_desc',
			filtering: {filterString: '', placeholder: 'Filtra descripción'}},
		{title: 'Situación', name: 'estatus_desc', columnName: 'estatus_desc',
			filtering: {filterString: '', placeholder: 'Filtra situación'}},
		{title: '', name: 'action_e', sort: false, filter: false},
		{title: '', name: 'action_c', sort: false, filter: false}
	];

	length = 0;

	constructor(public _puestosService: PuestosService, public _accesoService: AccesoService, private router: Router) {
	}

	ngOnInit() {
		this.cargando = true;
		this._puestosService.getPuestos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.data = this.jsonData.puestos;
					this._accesoService.guardarStorage(this.jsonData.token);

					for (let i = 0; i < this.data.length; i ++) {
						this.data [+i] ['action_e'] = `<a><span class='editar' data-id='`
							+ this.data [+i][this.llave] + `'><i class='far fa-edit'></i></span></a>`;
						this.data [+i] ['action_c'] = `<a><span class='cancelar' data-id='`
							+ this.data [+i][this.llave] + `'><i class='far fa-trash-alt'></i></span></a>`;
					}

					this.dataTable.columns = this.columns;
					this.dataTable.data = this.data;
					this.dataTable.length = this.jsonData.puestos.length;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.onChangeTable(this.dataTable.config);

					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

}
