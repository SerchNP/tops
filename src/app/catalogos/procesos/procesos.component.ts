import { Component, OnInit } from '@angular/core';
import { ProcesosService, UsersService } from '../../services/services.index';
import { Router } from '@angular/router';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
	selector: 'app-procesos',
	templateUrl: './procesos.component.html',
	styles: []
})

export class ProcesosComponent implements OnInit {

	jsonData: any;
	listadoProcesos: any[] = [];

	constructor(public _procesosService: ProcesosService, public _usersService: UsersService, private router: Router) { }

	ngOnInit() {
		this._procesosService.getProcesos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listadoProcesos = this.jsonData.procesos;
					this._usersService.guardarStorage = this.jsonData.token;
				},
				error => {
					// console.error(error);
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._usersService.logout();
					}
				});
	}

	editarProceso(proceso: any) {
		console.log(proceso);
		if (proceso.autoriza === 7) {
			swal('ERROR', 'El proceso ya está cancelado', 'error');
		} else {
			this.router.navigate(['/catalogos', 'procesos_form', 'U', proceso.proceso]);
		}
	}

	borrarProceso(proceso: any) {
		if (proceso.autoriza === 7) {
			swal('ERROR', 'El proceso ya está cancelado', 'error');
		} else {
			swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el proceso ' + proceso.descrip + '?',
				icon: 'warning',
				dangerMode: true,
				buttons: {
					cancel: {
						visible: true,
						value: false,
					},
					confirm: {
						text: 'Aceptar',
						value: true,
					},
				},
			}).then((value) => {
				if (value) {
					swal({
						text: 'Ingrese el motivo de cancelación del proceso',
						content: 'input',
						button: {
							text: 'Aceptar',
							closeModal: false,
						}
					}).then(motivo => {
						console.log(motivo);
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
									this._usersService.logout();
								}
							});
					});
				}
			});
		}
	}

}
