import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { AccesoService, DerechosService, OportunidadesService } from '../../../services/services.index';
import { Opciones } from '../../../interfaces/opciones.interface';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Aviso } from '../../../interfaces/aviso.interface';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-oportunidades',
	templateUrl: './oportunidades.component.html'
})

export class OportunidadesComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'oportunidades';

	listado: any[] = [];
	cargando = false;
	ruta_add =  ['/contexto', 'submenufichaproc', 'oportunidades_form', 'I', 0, 0, 'M'];
	ruta_p = ['/contexto', 'submenufichaproc', 'autoriza_oportunidades', 'A'];
	ruta_r = ['/contexto', 'submenufichaproc', 'autoriza_oportunidades', 'R'];
	select = false;
	allowMultiSelect = false;
	opciones: Opciones = { detalle: true };
	derechos: Derechos = {};
	avisos: Aviso = {};

	columns = [
		{ columnDef: 'proceso',     	    header: 'ID Proceso',		   align: 'center', cell: (oportunidad: any) => `${oportunidad.proceso}`},
		{ columnDef: 'proceso_desc',   	    header: 'Proceso', 			   cell: (oportunidad: any) => `${oportunidad.proceso_desc}`},
		{ columnDef: 'origen_desc', 	    header: 'Origen',  			   cell: (oportunidad: any) => `${oportunidad.origen_desc}`},
		{ columnDef: 'easproc_desc', 	    header: 'Descripción Origen',  cell: (oportunidad: any) => `${oportunidad.easproc_desc}`},
		{ columnDef: 'oportunidad', 		header: 'ID Oportunidad', 	   align: 'center', cell: (oportunidad: any) => `${oportunidad.oportunidad}`},
		{ columnDef: 'oportunidad_desc',	header: 'Oportunidad',		   cell: (oportunidad: any) => `${oportunidad.oportunidad_desc}`},
		{ columnDef: 'lista_foda', 	    	header: 'Cuestiones',  		   visible: false, cell: (oportunidad: any) => `${oportunidad.lista_foda}`},
		{ columnDef: 'responsable', 	 	header: 'Responsable',  	   visible: false, cell: (oportunidad: any) => `${oportunidad.responsable}`},
		{ columnDef: 'puesto_desc', 	 	header: 'Puesto',  			   visible: false, cell: (oportunidad: any) => `${oportunidad.puesto_desc}`},
		{ columnDef: 'autoriza_desc', 	 	header: 'Situación',		   cell: (oportunidad: any) => `${oportunidad.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	 	header: 'Estatus',			   cell: (oportunidad: any) => `${oportunidad.estatus_desc}`}
	];

	constructor(private _acceso: AccesoService,
				private _oportunidades: OportunidadesService,
				public _derechos: DerechosService,
				private router: Router,
				public dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.getAviso();
		this.subscription = this._oportunidades.getOportunidades(this._MENU)
			.subscribe(
				(data: any) => {
					this.listado = data.oportunidades;
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
		this.subscription.unsubscribe();
	}

	getDerechos() {
		this._derechos.getDerechosGlobalMenuPromesa(this._MENU).then((data: any) => {
			this.derechos = data;
		}).catch(error => {
			console.log(error);
		});
	}

	getAviso() {
		/*this.subscription = this._riesgo.getAvisoRiesgos(this._TIPOR, this._MENU)
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
				});*/
	}

	detectarAccion(datos: any): void {
		/*if (datos.accion === 'C') {
			this.cancelaRiesgo(datos.row);
		} if (datos.accion === 'E') {
			this.editaRiesgo(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		} else if (datos.accion === 'D') {
			this.detalleRiesgo(datos.row);
		}*/
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
				/*if (riesgo.autoriza === 1) {
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
				}*/
			}
		}
	}

	editaRiesgo(riesgo) {
		/*if (riesgo.autoriza === 7) {
			swal('ERROR', 'No es posible modificar el riesgo, ya se encuentra cancelado', 'error');
		} else {
			this.router.navigate(['/riesgos', 'riesgo_operativo_form', 'U', riesgo.riesgo, riesgo.autoriza, 'M']);
		}*/
	}

	detalleRiesgo(riesgo) {
		// this.router.navigate(['/riesgos', 'riesgo_operativo_form', 'V', riesgo.riesgo, riesgo.autoriza, 'M']);
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
