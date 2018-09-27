import { Component, OnInit, ViewChild } from '@angular/core';
import { PuestosService, AccesoService } from '../../services/services.index';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';


@Component({
	selector: 'app-puestos',
	templateUrl: './puestos.component.html',
	styles: []
})

export class PuestosComponent implements OnInit {

	@ViewChild('puestos') dataTable: DataTableComponent;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'puesto';
	derechos: Derechosmenu = {insertar: true, editar: true, cancelar: true};

	columns: Array<any> = [
		{title: 'Puesto', name: 'puesto', sort: false, columnName: 'puesto',
			filtering: {filterString: '', placeholder: 'Puesto'}},
		{title: 'Descripción', name: 'puesto_desc', sort: false, columnName: 'puesto_desc',
			filtering: {filterString: '', placeholder: 'Descripción'}},
		{title: 'ID Predecesor', name: 'predecesor', columnName: 'predecesor',
			filtering: {filterString: '', placeholder: 'ID Predecesor'}},
		{title: 'Predecesor', name: 'predecesor_desc', columnName: 'predecesor_desc',
			filtering: {filterString: '', placeholder: 'Predecesor'}},
		{title: 'Situación', name: 'estatus_desc', sort: false, columnName: 'estatus_desc',
			filtering: {filterString: '', placeholder: 'Situación'}}
	];

	constructor(public _puestosService: PuestosService, public _accesoService: AccesoService, private router: Router) {
	}

	ngOnInit() {
		this.cargando = true;
		// Para la inicializacion del dataTable
		this.dataTable.derechos = this.derechos;

		this._puestosService.getPuestos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.puestos;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.columns = this.columns;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.ruta_add = ['/paneladm', 'puestos_form', 'I', 0];
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
			this.editarPuesto(accion.row);
		} else if (accion.column === 'action_c') {
			this.borrarPuesto(accion.row);
		} else {
			// console.log('Columna no botón');
		}
	}

	editarPuesto(puesto: any) {
		if (puesto.estatus === 'N') {
			swal('ERROR', 'El puesto no se puede modificar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'puestos_form', 'U', puesto.puesto]);
		}
	}

	async borrarPuesto(puesto: any) {
		if (puesto.estatus === 'N') {
			swal('ERROR', 'El puesto ya está previamente cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el puesto ' + puesto.puesto_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación del puesto',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this._puestosService.cancelarPuesto(puesto.puesto, motivo.toUpperCase())
						.subscribe((data: any) => {
							this._accesoService.guardarStorage(data.token);
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							// console.log(error);
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
