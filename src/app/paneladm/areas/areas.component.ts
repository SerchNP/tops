import { Component, OnInit, ViewChild } from '@angular/core';
import { AreasService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Derechos } from '../../interfaces/derechos.interface';

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
	derechos: Derechos = {insertar: true, editar: true, cancelar: true};

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
					this.dataTable.ruta_add = ['/paneladm', 'areas_form', 'I', 0];
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
		if (accion.column === 'action_e') {
			this.editarArea(accion.row);
		} else if (accion.column === 'action_c') {
			this.borrarArea(accion.row);
		}
	}

	editarArea(area: any) {
		if (area.estatus === 'N') {
			swal('ERROR', 'El área no se puede modificar porque está cancelada', 'error');
		} else {
			this.router.navigate(['/paneladm', 'areas_form', 'U', area.area]);
		}
	}

	async borrarArea(area: any) {
		if (area.estatus === 'N') {
			swal('ERROR', 'El área ya está previamente cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el área ' + area.area_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación del área',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this._areasService.cancelarArea(area.area, motivo.toUpperCase())
						.subscribe((data: any) => {
							this._accesoService.guardarStorage(data.token);
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
