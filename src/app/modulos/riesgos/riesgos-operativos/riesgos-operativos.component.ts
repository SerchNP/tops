import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { AccesoService, RiesgoService, DerechosService } from '../../../services/services.index';
import { Opciones } from '../../../interfaces/opciones.interface';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Aviso } from '../../../interfaces/aviso.interface';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component ({
	selector: 'app-riesgos-operativos',
	templateUrl: './riesgos-operativos.component.html'
})
export class RiesgosOperativosComponent implements OnInit, OnDestroy {

	private _MENU = 'riesgo_operativo';
	private _TIPOR = 'O';

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	ruta_add =  ['/riesgos', 'riesgo_operativo_form', 'I', 0, 0, 'M'];
	ruta_p = ['/riesgos', 'autorizariesgoso_form', 'A'];
	ruta_r = ['/riesgos', 'autorizariesgoso_form', 'R'];
	select = false;
	allowMultiSelect = false;
	opciones: Opciones = { detalle: true };
	derechos: Derechos = {};
	avisos: Aviso = {};

	columns = [
		{ columnDef: 'proceso',     	    header: 'ID Proceso',		   align: 'center', cell: (riesgo: any) => `${riesgo.proceso}`},
		{ columnDef: 'proceso_desc',   	    header: 'Proceso', 			   cell: (riesgo: any) => `${riesgo.proceso_desc}`},
		{ columnDef: 'tipo_riesgo_desc', 	header: 'Tipo',  			   cell: (riesgo: any) => `${riesgo.tipo_riesgo_desc}`},
		{ columnDef: 'origen_desc', 	    header: 'Origen',  			   cell: (riesgo: any) => `${riesgo.origen_desc}`},
		{ columnDef: 'easproc_desc', 	    header: 'Descripción Origen',  cell: (riesgo: any) => `${riesgo.easproc_desc}`},
		{ columnDef: 'riesgo', 		 	    header: 'ID Riesgo', 		   align: 'center', cell: (riesgo: any) => `${riesgo.riesgo}`},
		{ columnDef: 'riesgo_desc',	 	    header: 'Riesgo Identificado', cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
		{ columnDef: 'estado_desc',     	header: 'Estado',  			   cell: (riesgo: any) => `${riesgo.predecesor_desc}`},
		{ columnDef: 'predecesor_desc',     header: 'Riesgo de Gestión',   visible: false, cell: (riesgo: any) => `${riesgo.predecesor_desc}`},
		{ columnDef: 'lista_causas', 	    header: 'Causas',  			   visible: false, cell: (riesgo: any) => `${riesgo.lista_causas}`},
		{ columnDef: 'lista_consecuencias', header: 'Consecuencias',  	   visible: false, cell: (riesgo: any) => `${riesgo.lista_consecuencias}`},
		{ columnDef: 'responsable', 	 	header: 'Responsable',  	   visible: false, cell: (riesgo: any) => `${riesgo.responsable}`},
		{ columnDef: 'puesto_desc', 	 	header: 'Puesto',  			   visible: false, cell: (riesgo: any) => `${riesgo.puesto_desc}`},
		{ columnDef: 'autoriza_desc', 	 	header: 'Situación',		   cell: (riesgo: any) => `${riesgo.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	 	header: 'Estatus',			   cell: (riesgo: any) => `${riesgo.estatus_desc}`}
	];

	constructor(private _acceso: AccesoService,
				private _riesgo: RiesgoService,
				public _derechos: DerechosService,
				private router: Router,
				public dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.getAviso();
		this.subscription = this._riesgo.getRiesgos(this._TIPOR, this._MENU)
			.subscribe(
				(data: any) => {
					this.listado = data.riesgos;
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

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.cancelaRiesgo(datos.row);
		} if (datos.accion === 'E') {
			this.editaRiesgo(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		} else if (datos.accion === 'D') {
			this.detalleRiesgo(datos.row);
		}
	}

	getDerechos() {
		this._derechos.getDerechosGlobalMenuPromesa(this._MENU).then((data: any) => {
			this.derechos = data;
		}).catch(error => {
			console.log(error);
		});
	}

	getAviso() {
		this.subscription = this._riesgo.getAvisoRiesgos(this._TIPOR, this._MENU)
			.subscribe(
				(data: any) => {
					this.avisos.pendientes = data.aviso.pendientes;
					this.avisos.rechazados = data.aviso.rechazados;
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

	async cancelaRiesgo(riesgo: any) {
		if (riesgo.autoriza === 7) {
			swal('ERROR', 'El riesgo ya se encuentra cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				// tslint:disable-next-line:max-line-length
				text: 'Está seguro que desea cancelar el riesgo "' + riesgo.riesgo_desc + '"?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				if (riesgo.autoriza === 1) {
					// Si esta capturado, se borra, por lo que no se pedirá el motivo
					this.subscription = this._riesgo.cancelarRiesgo(riesgo.riesgo, riesgo.tipo_riesgo, '')
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
				} else {
					const {value: motivo} = await swal({
						title: 'Ingrese el motivo de cancelación',
						input: 'textarea',
						showCancelButton: true,
						inputValidator: (value) => {
							return !value && 'Necesita ingresar el motivo de cancelación';
						}
					});
					if (motivo !== undefined) {
						this.subscription = this._riesgo.cancelarRiesgo(riesgo.riesgo, riesgo.tipo_riesgo, motivo.toUpperCase())
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
		}
	}

	editaRiesgo(riesgo) {
		if (riesgo.autoriza === 7) {
			swal('ERROR', 'No es posible modificar el riesgo, ya se encuentra cancelado', 'error');
		} else {
			this.router.navigate(['/riesgos', 'riesgo_operativo_form', 'U', riesgo.riesgo, riesgo.autoriza, 'M']);
		}
	}

	detalleRiesgo(riesgo) {
		this.router.navigate(['/riesgos', 'riesgo_operativo_form', 'V', riesgo.riesgo, riesgo.autoriza, 'M']);
	}

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: 'Riesgo ' + datos.tipo_riesgo_desc + ', ' + datos.estado_desc,
				texto: datos.riesgo_desc,
				situacion: datos.autoriza_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica,
				u_cancela: datos.u_cancela,
				f_cancela: datos.f_cancela,
				motivo_cancela: datos.motivo_cancela
			}
		});
	}

}
