import { Component, OnInit, ViewChild } from '@angular/core';
import { AccesoService } from '../../services/shared/acceso.service';
import swal from 'sweetalert2';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import { ProcesosService } from '../../services/services.index';
import { DataTableComponent } from '../../components/data-table/data-table.component';

@Component ({
	selector: 'app-area-proceso',
	templateUrl: './area-proceso.component.html',
	styles: []
})
export class AreaProcesoComponent implements OnInit {

	@ViewChild('areas_asignadas') dataTable: DataTableComponent;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'clave';
	derechos: Derechosmenu = {insertar: true, editar: true, cancelar: true};

	columns: Array<any> = [
		{title: 'Clave', name: 'clave', columnName: 'clave',
			filtering: {filterString: '', placeholder: 'Clave'}},
		{title: 'ID Área', name: 'area', columnName: 'area',
			filtering: {filterString: '', placeholder: 'ID Área'}},
		{title: 'Área', name: 'area_desc', columnName: 'area_desc',
			filtering: {filterString: '', placeholder: 'Área'}},
		{title: 'ID Proceso', name: 'proceso', columnName: 'proceso',
			filtering: {filterString: '', placeholder: 'ID Proceso'}},
		{title: 'Proceso', name: 'proceso_desc', sort: 'asc', columnName: 'proceso_desc',
			filtering: {filterString: '', placeholder: 'Proceso'}},
		{title: 'Tipo Área', name: 'tipo_area_desc', columnName: 'tipo_area_desc',
			filtering: {filterString: '', placeholder: 'Tipo Área'}},
		{title: 'Situación', name: 'activa_desc', columnName: 'activa_desc'}
	];

	constructor(private _accesoService: AccesoService,
				private _procesosService: ProcesosService) {
	}

	ngOnInit() {
		this.cargando = true;
		// Para la inicializacion del dataTable
		this.dataTable.derechos = this.derechos;

		this._procesosService.getAreasAsignadas(0)
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.areas_asignadas;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.columns = this.columns;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.ruta_add = ['/paneladm', 'submenuproc', 'area_proceso_form', 'I', 0];
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
