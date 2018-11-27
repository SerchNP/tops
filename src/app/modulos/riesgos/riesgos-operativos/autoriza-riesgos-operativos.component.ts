import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, RiesgoService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-autoriza-riesgos-operativos',
	templateUrl: './autoriza-riesgos-operativos.component.html'
})

export class AutorizaRiesgosOperativosComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando = true;
	listado: any[] = [];
	derechos: Derechos = {administrar: true, cancelar: true, editar: true, insertar: false};
	select = true;
	allowMultiSelect = true;
	accion: string;
	seleccionados: any[];
	cancelar: any[] = ['/riesgos', 'riesgo_operativo'];
	titulo: string;
	columns = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _riesgo: RiesgoService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];

			if (this.accion === 'A') {
				this.titulo = 'Pendientes';
				this.derechos.editar = false; // Deshabilita la edicion en la autorizacion
				this.columns = [
					{ columnDef: 'proceso',				header: 'ID Proceso',			align: 'center',	cell: (riesgo: any) => `${riesgo.proceso}`},
					{ columnDef: 'proceso_desc',		header: 'Proceso',									cell: (riesgo: any) => `${riesgo.proceso_desc}`},
					{ columnDef: 'origen_desc',			header: 'Origen',									cell: (riesgo: any) => `${riesgo.origen_desc}`},
					{ columnDef: 'easproc_desc',		header: 'Descripción Origen',						cell: (riesgo: any) => `${riesgo.easproc_desc}`},
					{ columnDef: 'riesgo',				header: 'ID riesgo',			align: 'center',	cell: (riesgo: any) => `${riesgo.riesgo}`},
					{ columnDef: 'riesgo_desc',			header: 'riesgo',									cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
					{ columnDef: 'estado_desc',			header: 'Estado',									cell: (riesgo: any) => `${riesgo.predecesor_desc}`},
					{ columnDef: 'lista_causas',		header: 'Causas',									cell: (riesgo: any) => `${riesgo.lista_causas}`},
					{ columnDef: 'lista_consecuencias',	header: 'Consecuencias',							cell: (riesgo: any) => `${riesgo.lista_consecuencias}`},
					{ columnDef: 'predecesor_desc',		header: 'Riesgo de Gestión',	visible: false,		cell: (riesgo: any) => `${riesgo.predecesor_desc}`},
					{ columnDef: 'autoriza_desc',		header: 'Situación',								cell: (riesgo: any) => `${riesgo.autoriza_desc}`},
					{ columnDef: 'motivo_modif',		header: 'Motivo del cambio',	visible: false,		cell: (riesgo: any) => `${riesgo.motivo_modif}`},
					{ columnDef: 'motivo_cancela',		header: 'Motivo Cancelación',						cell: (riesgo: any) => `${riesgo.motivo_cancela}`},
					{ columnDef: 'u_cancela',			header: 'Usuario Cancela',		visible: false,		cell: (riesgo: any) => `${riesgo.u_cancela}`},
					{ columnDef: 'f_cancela',			header: 'Fecha Cancela',		visible: false,		cell: (riesgo: any) => `${riesgo.f_cancela}`}
				];
			} else {
				this.titulo = 'Rechazados';
				this.columns = [
					{ columnDef: 'proceso',				header: 'ID Proceso',			align: 'center',	cell: (riesgo: any) => `${riesgo.proceso}`},
					{ columnDef: 'proceso_desc',		header: 'Proceso',									cell: (riesgo: any) => `${riesgo.proceso_desc}`},
					{ columnDef: 'origen_desc',			header: 'Origen',									cell: (riesgo: any) => `${riesgo.origen_desc}`},
					{ columnDef: 'easproc_desc',		header: 'Descripción Origen',						cell: (riesgo: any) => `${riesgo.easproc_desc}`},
					{ columnDef: 'riesgo',				header: 'ID riesgo',			align: 'center',	cell: (riesgo: any) => `${riesgo.riesgo}`},
					{ columnDef: 'riesgo_desc',			header: 'riesgo',									cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
					{ columnDef: 'estado_desc',			header: 'Estado',									cell: (riesgo: any) => `${riesgo.predecesor_desc}`},
					{ columnDef: 'lista_causas',		header: 'Causas',									cell: (riesgo: any) => `${riesgo.lista_causas}`},
					{ columnDef: 'lista_consecuencias',	header: 'Consecuencias',							cell: (riesgo: any) => `${riesgo.lista_consecuencias}`},
					{ columnDef: 'predecesor_desc',		header: 'Riesgo de Gestión',	visible: false,		cell: (riesgo: any) => `${riesgo.predecesor_desc}`},
					{ columnDef: 'autoriza_desc',		header: 'Situación',								cell: (riesgo: any) => `${riesgo.autoriza_desc}`},
					{ columnDef: 'motivo_modif',		header: 'Motivo del cambio',	visible: false,		cell: (riesgo: any) => `${riesgo.motivo_modif}`},
					{ columnDef: 'motivo_rechaza',		header: 'Motivo Rechazo',							cell: (riesgo: any) => `${riesgo.motivo_rechaza}`},
					{ columnDef: 'u_rechaza',			header: 'Usuario Rechaza',		visible: false,		cell: (riesgo: any) => `${riesgo.u_rechaza}`},
					{ columnDef: 'f_rechaza',			header: 'Fecha Rechazo',		visible: false,		cell: (riesgo: any) => `${riesgo.f_rechaza}`},
					{ columnDef: 'motivo_cancela',		header: 'Motivo Cancelación',	visible: false,		cell: (riesgo: any) => `${riesgo.motivo_cancela}`},
					{ columnDef: 'u_cancela',			header: 'Usuario Cancela',		visible: false,		cell: (riesgo: any) => `${riesgo.u_cancela}`},
					{ columnDef: 'f_cancela',			header: 'Fecha Cancela',		visible: false,		cell: (riesgo: any) => `${riesgo.f_cancela}`}
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
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	detectarRegistros(rows): void {
		this.seleccionados = rows;
	}

	getPendientes() {
		this.subscription = this._riesgo.getRiesgosPendientes('O')
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
		this.subscription = this._riesgo.getRiesgosRechazados('O')
			.subscribe(
				(data: any) => {
					this.listado = data.rechazados;
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			if (this.accion === 'A') {
				this.rechazarRiesgo(datos.row);
			} else if (this.accion === 'R') {
				this.cancelaRechazoRiesgo(datos.row);
			}
		} else if (datos.accion === 'E' && this.accion === 'R') {
			// Manda el form en modo <edicion> con origen <Rechazo>
			this.router.navigate(['/riesgos', 'riesgo_operativo_form', 'U', datos.row.riesgo, datos.row.autoriza, 'R']);
		}
	}

	guardar() {
		if (this.seleccionados === undefined || this.seleccionados.length === 0) {
			swal('Atención!!!', 'Debe seleccionar al menos un registro.', 'error');
		} else {
			const arreglo: any[] = [];
			this.seleccionados.forEach(element => {
				arreglo.push(JSON.parse('{"riesgo": ' + element['riesgo'] + ', "tipo_riesgo": "' + element['tipo_riesgo'] + '"}'));
			});
			if (this.accion === 'A') {
				this.subscription = this._riesgo.autorizarRiesgos(arreglo)
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
				this.subscription = this._riesgo.reautorizarRiesgos(arreglo)
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

	async rechazarRiesgo (registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea rechazar '
				+ ((registro.autoriza === '6' || registro.autoriza === '8') ? 'la cancelación del' : 'el') + ' riesgo?',
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
				this.subscription = this._riesgo.rechazarRiesgo(registro.riesgo, registro.tipo_riesgo, motivo.toUpperCase())
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

	async cancelaRechazoRiesgo(registro: any) {
		const { value: respuesta } = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea '
				+ ((registro.autoriza === 4) ? 'deshacer la Cancelación del' : 'cancelar el')
				+ ' riesgo "' + registro.riesgo_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			if (registro.autoriza === 4) {
				// Cuando es CANCELACIÓN RECHAZADA y se 'rechaza' se AUTORIZA nuevamente
				this.subscription = this._riesgo.rechazarRiesgo(registro.riesgo, registro.tipo_riesgo, '')
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
				this.subscription = this._riesgo.cancelarRiesgo(registro.riesgo, registro.tipo_riesgo, '')
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
