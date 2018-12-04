import { Component, OnInit, OnDestroy } from '@angular/core';
import { Derechos } from '../../../interfaces/derechos.interface';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { AccesoService, DerechosService, DireccionService, OportunidadesService } from '../../../services/services.index';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-oportunidades-acciones',
	templateUrl: './oportunidades-acciones.component.html'
})
export class OportunidadesAccionesComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'oportunidades';
	cargando = false;
	derechos: Derechos = {};
	select = false;
	allowMultiSelect = false;
	listado: any[] = [];
	ruta_add = ['/contexto', 'submenufichaproc', 'accion_oportunidad_form', 'I', 0];

	columns = [
		{ columnDef: 'proceso',     	 header: 'ID Proceso',  align: 'center', cell: (accionOp: any) => `${accionOp.proceso}`},
		{ columnDef: 'proceso_desc',   	 header: 'Proceso', 	cell: (accionOp: any) => `${accionOp.proceso_desc}`},
		{ columnDef: 'origen_desc', 	 header: 'Oportunidad', cell: (accionOp: any) => `${accionOp.origen_desc}`},
		{ columnDef: 'easproc_desc', 	 header: 'Entrada o Actividad', cell: (accionOp: any) => `${accionOp.easproc_desc}`},
		{ columnDef: 'accion_desc',      header: 'Acción',		cell: (accionOp: any) => `${accionOp.accion_desc}`},
		{ columnDef: 'f_inicio_t',     	 header: 'Fecha', 		cell: (accionOp: any) => `${accionOp.f_inicio_t}`},
		{ columnDef: 'responsable',      header: 'Responsable',	cell: (accionOp: any) => `${accionOp.responsable}`},
		{ columnDef: 'puesto_desc',      header: 'Puesto', 		cell: (accionOp: any) => `${accionOp.puesto_desc}`},
		{ columnDef: 'autoriza_desc',  	 header: 'Situación', 	cell: (accionOp: any) => `${accionOp.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	 header: 'Estatus',		cell: (accionOp: any) => `${accionOp.estatus_desc}`}
	];

	constructor(private router: Router,
				private _acceso: AccesoService,
				private _derechos: DerechosService,
				private _oportunidades: OportunidadesService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.subscription = this._oportunidades.getAccionesOportunidades(this._MENU)
			.subscribe((data: any) => {
				this.listado = data.acciones;
				this._acceso.guardarStorage(data.token);
					this.cargando = false;
			});
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	getDerechos() {
		this._derechos.getDerechosGlobalMenuPromesa(this._MENU).then((data: any) => {
			this.derechos = data;
		}).catch(error => {
			console.log(error);
		});
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'V') {
			this.openDialog(datos.row);
		} else if (datos.accion === 'E') {
			this.editaAccionOportunidad(datos.row);
		} else if (datos.accion === 'C') {
			this.cancelaAccionOportunidad(datos.row);
		}
	}

	editaAccionOportunidad(accion) {
		if (accion.autoriza === 7) {
			swal('ERROR', 'No es posible modificar la Acción, ya se encuentra cancelada', 'error');
		} else {
			this.router.navigate(['/contexto', 'submenufichaproc', 'accion_oportunidad_form', 'U', accion.accion_id]);
		}
	}

	async cancelaAccionOportunidad(datos: any) {
		if (datos.autoriza === 7) {
			swal('ERROR', 'La Acción ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: '¿Está seguro que desea cancelar la acción "' + datos.accion_desc
					+ '" de la oportunidad "' + datos.origen_desc + '"?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación',
					input: 'textarea',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._oportunidades.cancelarAccionOportunidad(datos.origen_id, datos.accion_id, motivo.toUpperCase())
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

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: 'ACCIÓN: ' + datos.accion_desc,
				texto: datos.origen_origen_desc + ': ' + datos.origen_desc,
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
