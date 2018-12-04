import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService, FodaService, ProcesosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { TitleCasePipe } from '@angular/common';

@Component({
	selector: 'app-autoriza-foda',
	templateUrl: './autoriza-foda.component.html'
})
export class AutorizaFodaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	proceso: number;
	// proceso_desc: string;
	titulo: string;
	cargando = true;
	listado: any[] = [];
	derechos: Derechos = {autorizar: true, administrar: true, cancelar: true, editar: true, insertar: false};
	select = true;
	allowMultiSelect = true;
	accion: string;
	seleccionados: any[];
	registro: any = {};
	columns = [];

	constructor(private activatedRoute: ActivatedRoute,
				private _acceso: AccesoService,
				private _proceso: ProcesosService,
				private _foda: FodaService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.accion = params['acc'];
			this.getProceso(this.proceso);

			if (this.accion === 'A') {
				this.titulo = 'Pendientes';
				this.derechos.editar = false;
				this.columns = [
					{ columnDef: 'cuestion_desc', 	header: 'Cuestión',				cell: (foda: any) => `${foda.cuestion_desc}`},
					{ columnDef: 'foda',     		header: 'ID',   				cell: (foda: any) => `${foda.foda}`},
					{ columnDef: 'orden',   		header: 'No.', 					cell: (foda: any) => `${foda.orden}`},
					{ columnDef: 'foda_desc',   	header: 'Descripción', 			cell: (foda: any) => `${foda.foda_desc}`},
					{ columnDef: 'autoriza_desc',   header: 'Situación',			cell: (foda: any) => `${foda.autoriza_desc}`},
					{ columnDef: 'motivo_cancela',	header: 'Motivo Cancelación',	cell: (foda: any) => `${foda.motivo_cancela}`}
				];
			} else {
				this.titulo = 'Rechazados';
				this.columns = [
					{ columnDef: 'cuestion_desc', 	header: 'Cuestión',				cell: (foda: any) => `${foda.cuestion_desc}`},
					{ columnDef: 'foda',     		header: 'ID',   				cell: (foda: any) => `${foda.foda}`},
					{ columnDef: 'orden',   		header: 'No.', 					cell: (foda: any) => `${foda.orden}`},
					{ columnDef: 'foda_desc',   	header: 'Descripción', 			cell: (foda: any) => `${foda.foda_desc}`},
					{ columnDef: 'autoriza_desc',   header: 'Situación',			cell: (foda: any) => `${foda.autoriza_desc}`},
					{ columnDef: 'motivo_rechaza',	header: 'Motivo Rechazo',		cell: (foda: any) => `${foda.motivo_rechaza}`},
					{ columnDef: 'u_rechaza',		header: 'Usuario Rechaza',		visible: false, cell: (foda: any) => `${foda.u_rechaza}`},
					{ columnDef: 'f_rechaza',		header: 'Fecha Rechazo',		visible: false, cell: (foda: any) => `${foda.f_rechaza}`},
					{ columnDef: 'u_preautoriza',	header: 'Usuario PreAutoriza',	visible: false, cell: (foda: any) => `${foda.u_preautoriza}`},
					{ columnDef: 'f_preautoriza',	header: 'Fecha PreAutoriza',	visible: false, cell: (foda: any) => `${foda.f_preautoriza}`},
					{ columnDef: 'u_cancela',		header: 'Usuario Cancela',		visible: false, cell: (foda: any) => `${foda.u_cancela}`},
					{ columnDef: 'f_cancela',		header: 'Fecha Cancela',		visible: false, cell: (foda: any) => `${foda.f_cancela}`},
					{ columnDef: 'motivo_cancela',	header: 'Motivo Cancelación',	visible: false, cell: (foda: any) => `${foda.motivo_cancela}`}
				];
			}
		});
	}

	ngOnInit() {
		this.cargando = true;
		if (this.accion === 'A') {
			this.subscription = this._foda.getFODAByProcesoPndtes(this.proceso)
				.subscribe(
					(data: any) => {
						this.listado = data.foda;
						this._acceso.guardarStorage(data.token);
						this.cargando = false;
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
		} else {
			this.subscription = this._foda.getFODAByProcesoRechazados(this.proceso)
				.subscribe(
					(data: any) => {
						this.listado = data.rechazados;
						this._acceso.guardarStorage(data.token);
						this.cargando = false;
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
		}
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	getProceso (proceso: number) {
		this.subscription = this._proceso.getProcesoById(proceso)
			.subscribe(
				(data: any) => {
					this.registro = data.proceso;
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	detectarRegistros(rows): void {
		this.seleccionados = rows;
	}

	guardar() {
		if (this.seleccionados === undefined || this.seleccionados.length === 0) {
			swal('Atención!!!', 'Debe seleccionar al menos un registro.', 'error');
		} else {
			const arreglo: any[] = [];
			this.seleccionados.forEach(element => {
				arreglo.push(JSON.parse('{"proceso" : ' + element['proceso'] + ', "foda" : ' + element['foda'] + '}'));
			});
			if (this.accion === 'A') {
				this.subscription = this._foda.autorizarFODA(arreglo)
					.subscribe((data: any) => {
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			} else if (this.accion === 'R') {
				this.subscription = this._foda.reautorizarFODA(arreglo)
					.subscribe((data: any) => {
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			}
		}
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			if (this.accion === 'A') {
				this.rechazarFODA(datos.row);
			} else if (this.accion === 'R') {
				this.cancelaRechazoFODA(datos.row);
			}
		} else if (datos.accion === 'E') {
			this.editarFODA(datos.row);
		}
	}

	async editarFODA(registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea modificar el descriptivo de la ' + registro.cuestion_desc + ' "' + registro.foda_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el nuevo descriptivo de la ' + registro.cuestion_desc,
				input: 'textarea',
				inputValue: registro.foda_desc,
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el descriptivo';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._foda.editaFODA(registro.foda, motivo, registro.cuestion_desc)
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			}
		}
	}

	async rechazarFODA(registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea rechazar la '
				+ ((registro.autoriza === 6 || registro.autoriza === 8) ? 'Cancelación de la ' : '')
				+ registro.cuestion_desc + ' "' + registro.foda_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el motivo de rechazo de la ' + registro.cuestion_desc,
				input: 'textarea',
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el motivo de rechazo';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._foda.rechazarFODA(registro.proceso, registro.foda, motivo)
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			}
		}
	}

	async cancelaRechazoFODA (registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea '
				+ ((registro.autoriza === 4) ? 'deshacer la Cancelación de la ' : 'cancelar la ')
				+ registro.cuestion_desc + ' "' + registro.foda_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			if (registro.autoriza === 4) {
				// Cuando es CANCELACIÓN RECHAZADA se Autoriza nuevamente
				this.subscription = this._foda.rechazarFODA(registro.proceso, registro.foda, '')
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			} else if (registro.autoriza === 5) {
				// Cuando está RECHAZADO y se "rechaza", se elimina (delete) de la tabla a través de la cancelacion
				this.subscription = this._foda.cancelaFODA(registro.foda, '', registro.cuestion_desc)
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			}
		}
	}

}
