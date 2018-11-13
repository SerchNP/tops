import { Component, OnInit, OnDestroy } from '@angular/core';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Opciones } from '../../../interfaces/opciones.interface';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { AccesoService, DerechosService, DireccionService, CatalogosService } from '../../../services/services.index';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-direccion',
	templateUrl: './direccion.component.html'
})

export class DireccionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'direccion';
	ruta_add =  ['/contexto', 'submenudirest', 'direccion_form', 'I', 0, 0];
	llave = 'regid';
	cargando = false;
	opciones: Opciones = { detalle: true };
	derechos: Derechos = {};
	select = false;
	allowMultiSelect = false;
	listado: any[] = [];
	estrategias: any[] = [];

	columns = [
		{ columnDef: 'proceso',     	 header: 'ID Proceso',   	   align: 'center', cell: (direst: any) => `${direst.proceso}`},
		{ columnDef: 'proceso_desc',   	 header: 'Proceso', 	       cell: (direst: any) => `${direst.proceso_desc}`},
		{ columnDef: 'estrategia_desc',  header: 'Estrategia', 	       cell: (direst: any) => `${direst.estrategia_desc}`},
		{ columnDef: 'orden_a',  	 	 header: 'No. A', 	       	   cell: (direst: any) => `${direst.orden_a}`},
		{ columnDef: 'foda_a_desc',  	 header: 'Cuestion A', 	       cell: (direst: any) => `${direst.foda_a_desc}`},
		{ columnDef: 'orden_b',  	 	 header: 'No. B', 	       	   cell: (direst: any) => `${direst.orden_b}`},
		{ columnDef: 'foda_b_desc',  	 header: 'Cuestion B', 	       cell: (direst: any) => `${direst.foda_b_desc}`},
		{ columnDef: 'autoriza_desc', 	 header: 'Situación',		   cell: (direst: any) => `${direst.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	 header: 'Estatus',			   cell: (direst: any) => `${direst.estatus_desc}`}
	];


	constructor(private _acceso: AccesoService,
				private _derechos: DerechosService,
				private _direccion: DireccionService,
				private _catalogos: CatalogosService,
				private dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.subscription = this._direccion.getDireccionEst(this._MENU)
			.subscribe((data: any) => {
				this.listado = data.direccionest;
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
		if (datos.accion === 'C') {
			// this.canceladirest(datos.row);
		} if (datos.accion === 'E') {
			// this.editadirest(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		} else if (datos.accion === 'D') {
			// this.detalledirest(datos.row);
		} else if (datos.accion === 'A') {
			// this.autorizadirest(datos.row);
		}
	}

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: datos.estrategia_desc,
				texto: 'Combinacion: "' + datos.foda_a_desc + '" y "' + datos.foda_b_desc + '"',
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

/*

	detalledirest(direst) {
		this.router.navigate(['/dirests', 'direst_gestion_form', 'V', direst.direst, direst.autoriza]);
	}
}
*/
