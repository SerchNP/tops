import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProcesosService, AccesoService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import { Proceso } from '../../models/proceso.model';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-procesos',
	templateUrl: './procesos.component.html',
})

export class ProcesosComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'proceso';
	derechos: Derechos = {insertar: true, editar: true, cancelar: true};
	ruta_add =  ['/paneladm', 'submenuproc', 'procesos_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'proceso',     	header: 'ID Proceso',		cell: (proceso: Proceso) => `${proceso.proceso}`},
		{ columnDef: 'proceso_desc',   	header: 'Proceso', 			cell: (proceso: Proceso) => `${proceso.proceso_desc}`},
		{ columnDef: 'predecesor',		header: 'ID Predecesor',	cell: (proceso: Proceso) => `${proceso.predecesor}`,	align: 'center'},
		{ columnDef: 'predecesor_desc', header: 'Predecesor',		cell: (proceso: Proceso) => `${proceso.predecesor_desc}`},
		{ columnDef: 'estatus',  		header: 'Abierto/Cerrado',	cell: (proceso: Proceso) => `${proceso.estatus}`, 		align: 'center'},
		{ columnDef: 'ent_data',  		header: 'Ent. Datos',		cell: (proceso: Proceso) => `${proceso.ent_data}`, 		align: 'center'},
		{ columnDef: 'autoriza_desc',	header: 'Estatus',			cell: (proceso: Proceso) => `${proceso.autoriza_desc}`}
	];

	constructor(private _procesosService: ProcesosService,
				private _accesoService: AccesoService,
				private router: Router) {}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._procesosService.getProcesos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.procesos;
					this._accesoService.guardarStorage(this.jsonData.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarProceso(datos.row);
		} else if (datos.accion === 'C') {
			this.borrarProceso(datos.row);
		}
	}

	editarProceso(proceso: Proceso) {
		if (proceso.autoriza === 7) {
			swal('ERROR', 'No es posible modificar, el proceso ya se encuentra cancelado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'submenuproc', 'procesos_form', 'U', proceso.proceso]);
		}
	}

	async borrarProceso(proceso: Proceso) {
		if (proceso.autoriza === 7) {
			swal('ERROR', 'El proceso ya se encuentra cancelado', 'error');
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
				if (motivo !== undefined) {
					this.subscription = this._procesosService.cancelaProceso(proceso.proceso, motivo.toUpperCase())
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

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

}
