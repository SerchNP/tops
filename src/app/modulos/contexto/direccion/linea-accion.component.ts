import { Component, OnInit, OnDestroy } from '@angular/core';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Opciones } from '../../../interfaces/opciones.interface';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { AccesoService, DerechosService, DireccionService } from '../../../services/services.index';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-linea-accion',
	templateUrl: './linea-accion.component.html'
})
export class LineaAccionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'lineas_accion';
	cargando = false;
	opciones: Opciones = { detalle: true };
	derechos: Derechos = {};
	select = false;
	allowMultiSelect = false;
	listado: any[] = [];

	columns = [
		{ columnDef: 'proceso',     	  header: 'ID Proceso',   	    align: 'center', cell: (direst: any) => `${direst.proceso}`},
		{ columnDef: 'proceso_desc',   	  header: 'Proceso', 	        cell: (direst: any) => `${direst.proceso_desc}`},
		{ columnDef: 'cuestion_a_desc',   header: 'Cuestion Externa/Interna A', cell: (direst: any) => `${direst.cuestion_a_desc}`},
		{ columnDef: 'cuestion_b_desc',   header: 'Cuestion Externa/Interna B', cell: (direst: any) => `${direst.cuestion_b_desc}`},
		{ columnDef: 'linea', 	  		  header: 'Clave',				cell: (direst: any) => `${direst.linea}`},
		{ columnDef: 'linea_desc', 	  	  header: 'Línea de Acción',	cell: (direst: any) => `${direst.linea_desc}`},
		{ columnDef: 'f_inicio', 		  header: 'Fecha inicio',		cell: (direst: any) => `${direst.f_inicio}`},
		{ columnDef: 'f_revision', 		  header: 'Fecha revisión',		cell: (direst: any) => `${direst.f_revision}`},
		{ columnDef: 'responsable', 	  header: 'Responsable',	    visible: false, cell: (direst: any) => `${direst.responsable}`},
		{ columnDef: 'puesto_resp_desc',  header: 'Puesto Responsable',	visible: false, cell: (direst: any) => `${direst.puesto_resp_desc}`},
		{ columnDef: 'evidencia',  		  header: 'evidencia',			visible: false, cell: (direst: any) => `${direst.evidencia}`},
		{ columnDef: 'autoriza_desc', 	  header: 'Situación',		    cell: (direst: any) => `${direst.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	  header: 'Estatus',			cell: (direst: any) => `${direst.estatus_desc}`}
	];


	constructor(private router: Router,
				private _acceso: AccesoService,
				private _derechos: DerechosService,
				private _direccion: DireccionService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.subscription = this._direccion.getLineasAccionDireccionEst(this._MENU)
			.subscribe((data: any) => {
				this.listado = data.lineas;
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
			this.derechos.insertar = false;
		}).catch(error => {
			console.log(error);
		});
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'V') {
			this.openDialog(datos.row);
		} else if (datos.accion === 'C') {
			this.cancelaLineaAccDE(datos.row);
		} else if (datos.accion === 'E') {
			this.editaLineaAccDE(datos.row);
		} else if (datos.accion === 'D') {
			this.consultaLineaAccDE(datos.row);
		}
	}

	async cancelaLineaAccDE(datos: any) {
		if (datos.autoriza === 7) {
			swal('ERROR', 'La Línea de Acción ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				// tslint:disable-next-line:max-line-length
				text: '¿Está seguro que desea cancelar la linea de acción "' + datos.linea_desc + '" para el proceso "' + datos.proceso_desc + '"?',
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
					this.subscription = this._direccion.cancelarLineaAccionDE(datos.linea, motivo.toUpperCase())
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

	consultaLineaAccDE(datos: any) {
		this.router.navigate(['/contexto', 'submenudirest', 'linea_form', 'V', datos.linea, datos.autoriza]);
	}

	editaLineaAccDE(datos: any) {
		if (datos.autoriza === 7) {
			swal('ERROR', 'La Línea de Acción ya se encuentra cancelada', 'error');
		} else {
			this.router.navigate(['/contexto', 'submenudirest', 'linea_form', 'U', datos.linea, datos.autoriza]);
		}
	}

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: datos.linea_desc,
				texto: datos.cuestion_a_desc + ' | ' + datos.cuestion_b_desc,
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
