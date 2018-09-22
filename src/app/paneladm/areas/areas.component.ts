import { Component, OnInit, ViewChild } from '@angular/core';
import { AreasService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableComponent } from '../../components/data-table/data-table.component';

@Component({
	selector: 'app-areas',
	templateUrl: './areas.component.html',
	styles: []
})
export class AreasComponent implements OnInit {

	@ViewChild('dtareas') dataTable: DataTableComponent;

	jsonData: any;
	data: any[] = [];
	cargando = false;
	llave = 'area';

	columns: Array<any> = [
		{title: 'Área', name: 'area', columnName: 'puesto',
			filtering: {filterString: '', placeholder: 'Área'}},
		{title: 'Predecesor', name: 'predecesor', columnName: 'predecesor',
			filtering: {filterString: '', placeholder: 'Predecesor'}},
		{title: 'Descripción', name: 'area_desc', sort: 'asc', columnName: 'area_desc',
			filtering: {filterString: '', placeholder: 'Descripción'}},
		{title: 'Tipo', name: 'tipo_desc', columnName: 'tipo_desc',
			filtering: {filterString: '', placeholder: 'Tipo'}},
		{title: 'Situación', name: 'estatus_desc', columnName: 'estatus_desc',
			filtering: {filterString: '', placeholder: 'Situación'}},
		{title: '', name: 'action_e', sort: false, filter: false},
		{title: '', name: 'action_c', sort: false, filter: false}
	];

	constructor(public _areasService: AreasService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this._areasService.getAreas()
			.subscribe(
				data => {
					this.jsonData = data;
					this.data = this.jsonData.areas;
					this._accesoService.guardarStorage(this.jsonData.token);

					for (let i = 0; i < this.data.length; i ++) {
						this.data [+i] ['action_e'] = `<a><span class='editar' data-id='`
							+ this.data [+i][this.llave] + `'><i class='far fa-edit'></i></span></a>`;
						this.data [+i] ['action_c'] = `<a><span class='cancelar' data-id='`
							+ this.data [+i][this.llave] + `'><i class='far fa-trash-alt'></i></span></a>`;
					}

					this.dataTable.columns = this.columns;
					this.dataTable.data = this.data;
					this.dataTable.length = this.jsonData.areas.length;
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
