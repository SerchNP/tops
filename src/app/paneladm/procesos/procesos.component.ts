import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcesosService, AccesoService } from '../../services/services.index';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
	selector: 'app-procesos',
	templateUrl: './procesos.component.html',
})

export class ProcesosComponent implements OnInit {

	@ViewChild('procesos') dataTable: DataTableComponent;

	tipoUser: string;
	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'proceso';

	length = 0;
	columns: Array<any> = [
		{title: 'Proceso', name: 'proceso', sort: 'asc', columnName: 'proceso',
			filtering: {filterString: '', placeholder: 'Proceso'}},
		{title: 'Predecesor', name: 'predecesor', columnName: 'predecesor',
			filtering: {filterString: '', placeholder: 'Predecesor'}},
		{title: 'Descripción', name: 'proceso_desc', columnName: 'proceso_desc',
			filtering: {filterString: '', placeholder: 'Descripción'}},
		{title: 'Abierto/Cerrado', name: 'estatus', columnName: 'estatus',
			filtering: {filterString: '', placeholder: 'Situación'}},
		{title: 'Ent. Datos', name: 'ent_data', columnName: 'ent_data',
			filtering: {filterString: '', placeholder: 'Ent. Datos'}},
		{title: 'Estatus', name: 'autoriza_desc', columnName: 'autoriza_desc',
			filtering: {filterString: '', placeholder: 'Estatus'}}
	];

	constructor(public _procesosService: ProcesosService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this.tipoUser = this._accesoService.tipoUsuario();

		this._procesosService.getProcesos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.procesos;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.insertar = true;
					this.dataTable.ruta_add = ['/paneladm', 'submenuproc', 'procesos_form', 'I', 0];
					this.dataTable.editar = true;
					this.dataTable.cancelar = true;
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
			this.editarProceso(accion.row);
		} else if (accion.column === 'action_c') {
			this.borrarProceso(accion.row);
		} else {
			console.log('Columna no botón');
		}
	}

	editarProceso(proceso: any) {
		if (proceso.autoriza === 7) {
			swal('ERROR', 'El proceso no se puede modificar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'submenuproc', 'procesos_form', 'U', proceso.proceso]);
		}
	}

	async borrarProceso(proceso: any) {
		if (proceso.autoriza === 7) {
			swal('ERROR', 'El proceso ya está cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el proceso ' + proceso.proceso_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación del proceso',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				console.log(motivo);
				if (motivo !== undefined) {
					this._procesosService.cancelaProceso(proceso.proceso, motivo.toUpperCase())
						.subscribe((data: any) => {
							console.log(data);
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							console.log(error);
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
