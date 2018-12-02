import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, OportunidadesService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-autoriza-oportunidades',
	templateUrl: './autoriza-oportunidades.component.html'
})

export class AutorizaOportunidadesComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando = true;
	listado: any[] = [];
	accion: string;
	titulo: string;
	columns = [];
	select = true;
	allowMultiSelect = true;
	seleccionados: any[];
	derechos: Derechos = {administrar: true, cancelar: true, editar: true, insertar: false};
	cancelar: any[] = ['/contexto', 'submenufichaproc', 'oportunidades'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _oportunidades: OportunidadesService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];

			if (this.accion === 'A') {
				this.titulo = 'Pendientes';
				this.derechos.editar = false; // Deshabilita la edicion en la autorizacion
				this.columns = [
					{ columnDef: 'proceso',		 		header: 'ID Proceso',			align: 'center',	cell: (oportunidad: any) => `${oportunidad.proceso}`},
					{ columnDef: 'proceso_desc',	 	header: 'Proceso',									cell: (oportunidad: any) => `${oportunidad.proceso_desc}`},
					{ columnDef: 'origen_desc',			header: 'Origen',									cell: (oportunidad: any) => `${oportunidad.origen_desc}`},
					{ columnDef: 'easproc_desc', 	    header: 'Descripción Origen',						cell: (oportunidad: any) => `${oportunidad.easproc_desc}`},
					{ columnDef: 'oportunidad', 		header: 'ID Oportunidad',		align: 'center',	cell: (oportunidad: any) => `${oportunidad.oportunidad}`},
					{ columnDef: 'oportunidad_desc',	header: 'Oportunidad',								cell: (oportunidad: any) => `${oportunidad.oportunidad_desc}`},
					{ columnDef: 'lista_foda', 	    	header: 'Cuestiones',			visible: false,		cell: (oportunidad: any) => `${oportunidad.lista_foda}`},
					{ columnDef: 'responsable', 	 	header: 'Responsable',			visible: false,		cell: (oportunidad: any) => `${oportunidad.responsable}`},
					{ columnDef: 'puesto_desc', 	 	header: 'Puesto',				visible: false,		cell: (oportunidad: any) => `${oportunidad.puesto_desc}`},
					{ columnDef: 'autoriza_desc',		header: 'Situación',								cell: (oportunidad: any) => `${oportunidad.autoriza_desc}`},
					{ columnDef: 'motivo_modif',		header: 'Motivo del cambio',	visible: false,		cell: (oportunidad: any) => `${oportunidad.motivo_modif}`},
					{ columnDef: 'motivo_cancela',		header: 'Motivo Cancelación',						cell: (oportunidad: any) => `${oportunidad.motivo_cancela}`},
					{ columnDef: 'u_cancela',			header: 'Usuario Cancela',		visible: false,		cell: (oportunidad: any) => `${oportunidad.u_cancela}`},
					{ columnDef: 'f_cancela',			header: 'Fecha Cancela',		visible: false,		cell: (oportunidad: any) => `${oportunidad.f_cancela}`}
				];
			} else {
				this.titulo = 'Rechazados';
				this.columns = [
						{ columnDef: 'proceso',		 		header: 'ID Proceso',			align: 'center',	cell: (oportunidad: any) => `${oportunidad.proceso}`},
						{ columnDef: 'proceso_desc',	 	header: 'Proceso',									cell: (oportunidad: any) => `${oportunidad.proceso_desc}`},
						{ columnDef: 'origen_desc',			header: 'Origen',									cell: (oportunidad: any) => `${oportunidad.origen_desc}`},
						{ columnDef: 'easproc_desc', 	    header: 'Descripción Origen',						cell: (oportunidad: any) => `${oportunidad.easproc_desc}`},
						{ columnDef: 'oportunidad', 		header: 'ID Oportunidad',		align: 'center',	cell: (oportunidad: any) => `${oportunidad.oportunidad}`},
						{ columnDef: 'oportunidad_desc',	header: 'Oportunidad',								cell: (oportunidad: any) => `${oportunidad.oportunidad_desc}`},
						{ columnDef: 'lista_foda', 	    	header: 'Cuestiones',			visible: false,		cell: (oportunidad: any) => `${oportunidad.lista_foda}`},
						{ columnDef: 'autoriza_desc',		header: 'Situación',								cell: (oportunidad: any) => `${oportunidad.autoriza_desc}`},
						{ columnDef: 'motivo_rechaza',		header: 'Motivo Rechazo',							cell: (oportunidad: any) => `${oportunidad.motivo_rechaza}`},
						// tslint:disable-next-line:max-line-length
						{ columnDef: 'motivo_modif',		header: 'Motivo del cambio',	visible: false,		cell: (oportunidad: any) => `${oportunidad.motivo_modif}`},
						{ columnDef: 'u_cancela',			header: 'Usuario Cancela',		visible: false,		cell: (oportunidad: any) => `${oportunidad.u_cancela}`},
						{ columnDef: 'f_cancela',			header: 'Fecha Cancela',		visible: false,		cell: (oportunidad: any) => `${oportunidad.f_cancela}`},
						// tslint:disable-next-line:max-line-length
						{ columnDef: 'motivo_cancela',		header: 'Motivo Cancelación',	visible: false,		cell: (oportunidad: any) => `${oportunidad.motivo_cancela}`},
						{ columnDef: 'u_rechaza',			header: 'Usuario Rechaza',		visible: false,		cell: (oportunidad: any) => `${oportunidad.u_rechaza}`},
						{ columnDef: 'f_rechaza',			header: 'Fecha Rechazo',		visible: false,		cell: (oportunidad: any) => `${oportunidad.f_rechaza}`}
				];
			}
		});
	}

	ngOnInit() {
		this.cargando = true;
		if (this.accion === 'A') {
			this.getPendientes();
		} else if (this.accion === 'R') {
			this.getRechazados();
		}
		this.cargando = false;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getPendientes() {
		this.subscription = this._oportunidades.getOportunidadesPendientes()
			.subscribe(
				(data: any) => {
					this.listado = data.pendientes;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				}
			);
	}

	getRechazados() {
		this.subscription = this._oportunidades.getOportunidadesRechazadas()
			.subscribe(
				(data: any) => {
					this.listado = data.rechazadas;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				}
			);
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
				arreglo.push(JSON.parse('{"oportunidad": ' + element['oportunidad'] + '}'));
			});
			if (this.accion === 'A') {
				this.subscription = this._oportunidades.autorizarOportunidad(arreglo)
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
			} else if (this.accion === 'R') {
				this.subscription = this._oportunidades.reautorizarOportunidad(arreglo)
					.subscribe(
						(data: any) => {
							this._acceso.guardarStorage(data.token);
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
							}
						}
					);
			}
		}
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			if (this.accion === 'A') {
				this.rechazarOportunidad(datos.row);
			} else if (this.accion === 'R') {
				this.cancelaRechazoOportunidad(datos.row);
			}
		} else if (datos.accion === 'E' && this.accion === 'R') {
			// Manda el form en modo <edicion> con origen <Rechazo>
			this.router.navigate(['/contexto', 'submenufichaproc', 'oportunidades_form', 'U', datos.row.oportunidad, datos.row.autoriza, 'R']);
		}
	}

	async rechazarOportunidad (registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea rechazar '
				+ ((registro.autoriza === '6' || registro.autoriza === '8') ? 'la cancelación de la' : 'la') + ' oportunidad?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el motivo de rechazo',
				input: 'textarea',
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el motivo de rechazo';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._oportunidades.rechazarOportunidad(registro.oportunidad, motivo.toUpperCase())
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

	async cancelaRechazoOportunidad(registro: any) {
		const { value: respuesta } = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea '
				+ ((registro.autoriza === 4) ? 'deshacer la Cancelación de la' : 'cancelar la')
				+ ' oportunidad "' + registro.oportunidad_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			if (registro.autoriza === 4) {
				// Cuando es CANCELACIÓN RECHAZADA y se 'rechaza' se AUTORIZA nuevamente
				this.subscription = this._oportunidades.rechazarOportunidad(registro.oportunidad, '')
					.subscribe(
						(data: any) => {
							this._acceso.guardarStorage(data.token);
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
							}
						}
					);
			} else if (registro.autoriza === 5) {
				// Cuando está RECHAZADO y se 'rechaza'
				// Se elimina de la tabla, siempre y cuando no se trate de un cambio de lo ya autorizado
				this.subscription = this._oportunidades.cancelaOportunidad(registro.oportunidad, '')
					.subscribe(
						(data: any) => {
							this._acceso.guardarStorage(data.token);
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
							}
						}
					);
			}
		}
	}

}
