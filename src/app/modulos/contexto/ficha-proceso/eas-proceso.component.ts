import { Component, OnInit, OnDestroy } from '@angular/core';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Opciones } from '../../../interfaces/opciones.interface';
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
	opciones: Opciones = { detalle: true };
	derechos: Derechos = {};
	select = false;
	allowMultiSelect = false;
	listado: any[] = [];
	ruta_add = ['/contexto', 'submenufichaproc', 'eas_proceso_form', 'I'];

	columns = [
		{ columnDef: 'proceso',     	header: 'ID Proceso',		align: 'center', cell: (easproc: any) => `${easproc.proceso}`},
		{ columnDef: 'proceso_desc',   	header: 'Proceso', 	        cell: (easproc: any) => `${easproc.proceso_desc}`},
		{ columnDef: 'tipo_desc',   	header: 'Tipo', 			cell: (easproc: any) => `${easproc.tipo_desc}`},
		// { columnDef: 'clave', 	  		header: 'Clave',			cell: (easproc: any) => `${easproc.clave}`},
		{ columnDef: 'consecutivo', 	header: 'No.',				cell: (easproc: any) => `${easproc.consecutivo}`},
		{ columnDef: 'descripcion', 	header: 'Descripción',		cell: (easproc: any) => `${easproc.descripcion}`},
		{ columnDef: 'clasif', 		  	header: 'Clasificación',	cell: (easproc: any) => `${easproc.clasif}`},
		{ columnDef: 'descripcion_pdc',	header: 'P/D/C',			cell: (easproc: any) => `${easproc.descripcion_pdc}`},
		{ columnDef: 'responsable', 	header: 'Responsable',	    visible: false, cell: (easproc: any) => `${easproc.responsable}`},
		{ columnDef: 'autoriza_desc', 	header: 'Situación',		cell: (easproc: any) => `${easproc.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	header: 'Estatus',			cell: (easproc: any) => `${easproc.estatus_desc}`}
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
			// this.cancelaLineaAccDE(datos.row);
		} else if (datos.accion === 'E') {
			// this.editaLineaAccDE(datos.row);
		} else if (datos.accion === 'D') {
			// this.consultaLineaAccDE(datos.row);
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
