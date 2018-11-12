import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccesoService, FodaService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-rechazos-foda',
	templateUrl: './rechazos-foda.component.html'
})
export class RechazosFodaComponent implements OnInit, OnDestroy {
	private subscription: Subscription;
	proceso: number;
	proceso_desc: string;

	cargando = true;
	listado: any[] = [];
	derechos: Derechos = {administrar: true, cancelar: true, editar: true, insertar: false};
	select = true;
	allowMultiSelect = true;
	accion = 'R';
	seleccionados: any[];

	columns = [
		{ columnDef: 'cuestion_desc', 	header: 'Cuestión',				cell: (foda: any) => `${foda.cuestion_desc}`},
		{ columnDef: 'foda',     		header: 'ID',   				cell: (foda: any) => `${foda.foda}`},
		{ columnDef: 'orden',   		header: 'No.', 					cell: (foda: any) => `${foda.orden}`},
		{ columnDef: 'foda_desc',   	header: 'Descripción', 			cell: (foda: any) => `${foda.foda_desc}`},
		{ columnDef: 'autoriza_desc',   header: 'Situación',			cell: (foda: any) => `${foda.autoriza_desc}`},
		{ columnDef: 'motivo_rechaza',	header: 'Motivo Rechazo',		cell: (foda: any) => `${foda.motivo_rechaza}`},
		{ columnDef: 'u_rechaza',		header: 'Usuario Rechaza',		cell: (foda: any) => `${foda.u_rechaza}`,		visible: false},
		{ columnDef: 'f_rechaza',		header: 'Fecha Rechazo',		cell: (foda: any) => `${foda.f_rechaza}`, 		visible: false},
		{ columnDef: 'u_preautoriza',	header: 'Usuario PreAutoriza',	cell: (foda: any) => `${foda.u_preautoriza}`,	visible: false},
		{ columnDef: 'f_preautoriza',	header: 'Fecha PreAutoriza',	cell: (foda: any) => `${foda.f_preautoriza}`,	visible: false},
		{ columnDef: 'u_cancela',		header: 'Usuario Cancela',		cell: (foda: any) => `${foda.u_cancela}`,		visible: false},
		{ columnDef: 'f_cancela',		header: 'Fecha Cancela',		cell: (foda: any) => `${foda.f_cancela}`,		visible: false},
		{ columnDef: 'motivo_cancela',	header: 'Motivo Cancelación',	cell: (foda: any) => `${foda.motivo_cancela}`,	visible: false}
	];

	constructor(private activatedRoute: ActivatedRoute,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._fodaService.getFODAByProcesoRechazados(this.proceso)
			.subscribe(
				(data: any) => {
					this.listado = data.rechazados;
					this._accesoService.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
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
			this.subscription = this._fodaService.reautorizarFODA(arreglo)
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.rechazarFODA(datos.row);
		} else if (datos.accion === 'E') {
			this.editarFODA(datos.row);
		}
	}

	async rechazarFODA(registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea rechazar la ' + registro.cuestion_desc + ' "' + registro.foda_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			if (registro.autoriza === 4) {
				// Cuando esta CANCELACIÓN RECHAZADA y se "rechaza", se pone en PENDIENTE
				// (NO veo la nececidad de pedir motivo si se va aborrar por el trigger)
				this.subscription = this._fodaService.rechazarFODA(registro.proceso, registro.foda, '')
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
			} else if (registro.autoriza === 5) {
				// Cuando está RECHAZADO y se "rechaza", se elimina(delete) de la tabla
				this.subscription = this._fodaService.cancelaFODA(registro.foda, '', registro.cuestion_desc)
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
				this.subscription = this._fodaService.editaFODA(registro.foda, motivo, registro.cuestion_desc)
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
