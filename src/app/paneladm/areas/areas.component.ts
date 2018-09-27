import { Component, OnInit, ViewChild } from '@angular/core';
import { AreasService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';

@Component({
	selector: 'app-areas',
	templateUrl: './areas.component.html',
	styles: []
})
export class AreasComponent implements OnInit {

	@ViewChild('areas') dataTable: DataTableComponent;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'area';
	derechos: Derechosmenu = {insertar: true, editar: true, cancelar: true};

	columns: Array<any> = [
		{title: 'Área', name: 'area', columnName: 'area',
			filtering: {filterString: '', placeholder: 'Área'}},
		{title: 'Descripción', name: 'area_desc', sort: 'asc', columnName: 'area_desc',
			filtering: {filterString: '', placeholder: 'Descripción'}},
		{title: 'ID Predecesor', name: 'predecesor', columnName: 'predecesor',
			filtering: {filterString: '', placeholder: 'ID Predecesor'}},
		{title: 'Predecesor', name: 'predecesor_desc', columnName: 'predecesor_desc',
			filtering: {filterString: '', placeholder: 'Predecesor'}},
		{title: 'Tipo', name: 'tipo_desc', columnName: 'tipo_desc',
			filtering: {filterString: '', placeholder: 'Tipo'}},
		{title: 'Situación', name: 'estatus_desc', columnName: 'estatus_desc',
			filtering: {filterString: '', placeholder: 'Situación'}},
		{title: 'Ent. Datos', name: 'ent_data', columnName: 'ent_data'}
	];

	constructor(public _areasService: AreasService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		// Para la inicializacion del dataTable
		this.dataTable.derechos = this.derechos;

		this._areasService.getAreas()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.areas;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.columns = this.columns;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					// this.dataTable.ruta_add = ['/paneladm', 'areas_form', 'I', 0];
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
