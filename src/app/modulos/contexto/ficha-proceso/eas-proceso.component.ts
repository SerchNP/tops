import { Component, OnInit, OnDestroy } from '@angular/core';
import { Derechos } from '../../../interfaces/derechos.interface';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { AccesoService, DerechosService, FichaProcesoService } from '../../../services/services.index';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-eas-proceso',
	templateUrl: './eas-proceso.component.html'
})
export class EASProcesoComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'eas_proceso';
	cargando = false;
	derechos: Derechos = {};
	select = false;
	allowMultiSelect = false;
	listado: any[] = [];
	ruta_add = ['/contexto', 'submenufichaproc', 'eas_proceso_form', 'I'];

	columns = [
		{ columnDef: 'proceso',     	header: 'ID Proceso',		 align: 'center', cell: (easproc: any) => `${easproc.proceso}`},
		{ columnDef: 'proceso_desc',   	header: 'Proceso', 	         cell: (easproc: any) => `${easproc.proceso_desc}`},
		{ columnDef: 'clave', 	  		header: 'Clave',			 cell: (easproc: any) => `${easproc.clave}`},
		{ columnDef: 'tipo_desc',   	header: 'Tipo', 			 cell: (easproc: any) => `${easproc.tipo_desc}`},
		{ columnDef: 'consecutivo', 	header: 'No.',				 cell: (easproc: any) => `${easproc.consecutivo}`},
		{ columnDef: 'descripcion', 	header: 'Descripción',		 cell: (easproc: any) => `${easproc.descripcion}`},
		{ columnDef: 'responsable', 	header: 'Responsable',	     visible: false, cell: (easproc: any) => `${easproc.responsable}`},
		{ columnDef: 'descripcion_pdc',	header: 'Descripción P/D/C', visible: false, cell: (easproc: any) => `${easproc.descripcion_pdc}`},
		{ columnDef: 'clasif', 		  	header: 'Clasificación',	 visible: false, cell: (easproc: any) => `${easproc.clasif}`},
		{ columnDef: 'autoriza_desc', 	header: 'Situación',		 cell: (easproc: any) => `${easproc.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	header: 'Estatus',			 cell: (easproc: any) => `${easproc.estatus_desc}`}
	];

	constructor(private router: Router,
				private _acceso: AccesoService,
				private _derechos: DerechosService,
				private _fichaproc: FichaProcesoService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.subscription = this._fichaproc.getListadoEAS(this._MENU)
			.subscribe((data: any) => {
				this.listado = data.easproc;
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
		} else if (datos.accion === 'C') {
			this.cancelarEAS(datos.row);
		} else if (datos.accion === 'E') {
			this.editarEAS(datos.row);
		}
	}

	editarEAS (datos: any) {
		if (datos.autoriza === 7) {
			swal('ERROR', 'No es posible editar, la ' + datos.tipo_desc + ' ya se encuentra cancelada', 'error');
		} else {
			this.router.navigate(['/contexto', 'submenufichaproc', 'eas_proceso_edicion', 'U', datos.clave, datos.tipo]);
		}
	}

	async cancelarEAS(datos: any) {
		if (datos.autoriza === 7) {
			swal('ERROR', 'La ' + datos.tipo_desc + ' ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: '¿Está seguro que desea cancelar la ' + datos.tipo_desc + ' "' + datos.descripcion + '"?',
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
					this.subscription = this._fichaproc.cancelarEASProceso(datos.clave, motivo.toUpperCase())
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
				subtitle: datos.descripcion,
				texto: datos.tipo_desc + ' ' + datos.consecutivo,
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
