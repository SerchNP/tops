import { Component, OnInit } from '@angular/core';
import { ProcesosService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import swal from 'sweetalert2';


@Component({
	selector: 'app-procesos',
	templateUrl: './procesos.component.html',
	styles: []
})

export class ProcesosComponent implements OnInit {

	jsonData: any;
	listadoProcesos: any[] = [];
	cargando = false;

	constructor(public _procesosService: ProcesosService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this._procesosService.getProcesos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listadoProcesos = this.jsonData.procesos;
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
