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

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'proceso';

	length = 0;
	columns: Array<any> = [
		{title: 'Proceso', name: 'proceso', sort: 'asc', columnName: 'proceso',
			filtering: {filterString: '', placeholder: 'Filtra proceso'}},
		{title: 'Predecesor', name: 'predecesor', columnName: 'predecesor',
			filtering: {filterString: '', placeholder: 'Filtra predecesor'}},
		{title: 'Descripción', name: 'proceso_desc', columnName: 'proceso_desc',
			filtering: {filterString: '', placeholder: 'Filtra descripción'}},
		{title: 'Abierto/Cerrado', name: 'estatus', columnName: 'estatus',
			filtering: {filterString: '', placeholder: 'Filtra situación'}},
		{title: 'Ent. Datos', name: 'ent_data', columnName: 'ent_data',
			filtering: {filterString: '', placeholder: 'Filtra'}},
		{title: 'Estatus', name: 'autoriza_desc', columnName: 'autoriza_desc',
			filtering: {filterString: '', placeholder: 'Filtra estatus'}},
		{title: '', name: 'action_e', sort: false, filter: false},
		{title: '', name: 'action_c', sort: false, filter: false}
	];

	constructor(public _procesosService: ProcesosService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this._procesosService.getProcesos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.procesos;
					this._accesoService.guardarStorage(this.jsonData.token);

					for (let i = 0; i < this.listado.length; i ++) {
						this.listado [+i] ['action_e'] = `<a><span class='editar' data-id='`
							+ this.listado [+i][this.llave] + `'><i class='far fa-edit'></i></span></a>`;
						this.listado [+i] ['action_c'] = `<a><span class='cancelar' data-id='`
							+ this.listado [+i][this.llave] + `'><i class='far fa-trash-alt'></i></span></a>`;
					}

					this.dataTable.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.ruta_add = ['/catalogos', 'procesos_form', 'I', 0];
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

	editarProceso(proceso: any) {
		// console.log(proceso);
		if (proceso.autoriza === 7) {
			swal('ERROR', 'El proceso no se puede modificar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/catalogos', 'procesos_form', 'U', proceso.proceso]);
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
