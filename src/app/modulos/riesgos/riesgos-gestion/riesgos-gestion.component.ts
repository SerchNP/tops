import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { RiesgoService, DerechosService } from '../../../services/services.index';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component ({
	selector: 'app-riesgos-gestion',
	templateUrl: './riesgos-gestion.component.html'
})
export class RiesgosGestionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	menu = 'riesgo_gestion';
	ruta_add =  ['/riesgos', 'riesgo_gestion_form', 'I', 0, 0];
	select = false;
	allowMultiSelect = false;
	derechos: Derechos = {};

	columns = [
		{ columnDef: 'proceso',     	 header: 'ID Proceso',   	   align: 'center', cell: (riesgo: any) => `${riesgo.proceso}`},
		{ columnDef: 'proceso_desc',   	 header: 'Proceso', 	       cell: (riesgo: any) => `${riesgo.proceso_desc}`},
		{ columnDef: 'riesgo', 		 	 header: 'Clave', 	    	   align: 'center', cell: (riesgo: any) => `${riesgo.riesgo}`},
		{ columnDef: 'riesgo_desc',	 	 header: 'riesgo',    	   cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
		{ columnDef: 'autoriza_desc', 	 header: 'Situación',		   cell: (riesgo: any) => `${riesgo.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	 header: 'Estatus',			   cell: (riesgo: any) => `${riesgo.estatus_desc}`}
	];

	constructor(private _acceso: AccesoService,
				private _riesgo: RiesgoService,
				public _derechos: DerechosService,
				private router: Router,
				public dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.subscription = this._riesgo.getRiesgos('G', 'riesgo_gestion')
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
		} else if (datos.accion === 'A') {
			this.autorizaRiesgo(datos.row);
		}
	}

	getDerechos() {
		this._derechos.getDerechosGlobalMenuPromesa(this.menu).then((data: any) => {
			this.derechos = data;
			// this._derechos.PRIVILEGIOS = data;
			// localStorage.setItem('actionsRG', JSON.stringify(this.derechos));
		}).catch(error => {
			console.log(error);
		});
	}

	autorizaRiesgo(riesgo) {
		if (riesgo.pendiente === 'N') {
			swal('ERROR', 'No es posible autorizar/rechazar el riesgo', 'error');
		} else {
			this.router.navigate(['/riesgos', 'riesgo_form', 'A', riesgo.riesgo, riesgo.autoriza, 0]);
		}
	}

	async cancelaRiesgo(riesgo: any) {
		if (riesgo.autoriza === 7) {
			swal('ERROR', 'El riesgo ya se encuentra cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				// tslint:disable-next-line:max-line-length
				text: 'Está seguro que desea cancelar el riesgo "' + riesgo.riesgo_desc + '" del proceso ' + riesgo.proceso_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				if (riesgo.autoriza === 1) {
					// Si esta capturado, se borra, por lo que no se pedirá el motivo
					/*this.subscription = this._riesgo.cancelaRiesgo(riesgo.riesgo, '')
						.subscribe((data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
							}
						});*/
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
						/*this.subscription = this._riesgo.cancelaRiesgo(riesgo.riesgo, motivo.toUpperCase())
							.subscribe((data: any) => {
								swal('Atención!!!', data.message, 'success');
								this.ngOnInit();
							},
							error => {
								swal('ERROR', error.error.message, 'error');
								if (error.error.code === 401) {
									this._acceso.logout();
								}
							});*/
					}
				}
			}
		}
	}

	editaRiesgo(riesgo) {
		if (riesgo.autoriza === 7) {
			swal('ERROR', 'No es posible modificar el riesgo, ya se encuentra cancelado', 'error');
		} else {
			this.router.navigate(['/riesgos', 'riesgo_gestion_form', 'U', riesgo.riesgo, riesgo.autoriza]);
		}
	}

	detalleRiesgo(riesgo) {
		console.log(riesgo);
		this.router.navigate(['/riesgos', 'riesgo_gestion_form', 'V', riesgo.riesgo, riesgo.autoriza]);
	}

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: datos.riesgo_desc,
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