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
	derechos: Derechosmenu = {insertar: true, editar: false, cancelar: true}; // No tiene opcion de editar

	columns: Array<any> = [
		{title: 'Clave', name: 'clave', columnName: 'clave'},
		{title: 'ID Proceso', name: 'proceso', columnName: 'proceso',
			filtering: {filterString: '', placeholder: 'ID Proceso'}},
		{title: 'Proceso', name: 'proceso_desc', sort: 'asc', columnName: 'proceso_desc',
			filtering: {filterString: '', placeholder: 'Proceso'}},
		{title: 'ID Área', name: 'area', columnName: 'area',
			filtering: {filterString: '', placeholder: 'ID Área'}},
		{title: 'Área', name: 'area_desc', columnName: 'area_desc',
			filtering: {filterString: '', placeholder: 'Área'}},
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

	detectarAccion(accion: any): void {
		if (accion.column === 'action_c') {
			this.cancelaAreaAsignada(accion.row);
		}
	}

	async cancelaAreaAsignada(areaPproceso: any) {
		if (areaPproceso.activa === 'N') {
			swal('ERROR', 'La asignación ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el area ' + areaPproceso.area_desc + ' para el proceso ' + areaPproceso.proceso_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this._procesosService.cancelaAreaAsignada(areaPproceso.clave, motivo.toUpperCase())
						.subscribe((data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._accesoService.logout();
							}
						});
				}
			}
		}
	}

}
