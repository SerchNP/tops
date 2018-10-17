import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService, FodaService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-listado-foda',
	templateUrl: './listado-foda.component.html'
})

export class ListadoFodaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	tipo_user: string;
	cargando = false;
	listado: any[] = [];
	jsonData: any;
	derechos: Derechos = {consultar: false, administrar: true, insertar: false, editar: true, cancelar: true};
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'proceso', 		header: 'ID Proceso',	cell: (foda: any) => `${foda.proceso}`},
		{ columnDef: 'proceso_desc',   	header: 'Proceso',		cell: (foda: any) => `${foda.proceso_desc}`},
		{ columnDef: 'cuestion_desc', 	header: 'Cuestión',		cell: (foda: any) => `${foda.cuestion_desc}`},
		{ columnDef: 'foda',			header: 'ID',			cell: (foda: any) => `${foda.foda}`},
		{ columnDef: 'orden',			header: 'Núm',			cell: (foda: any) => `${foda.orden}`},
		{ columnDef: 'foda_desc',		header: 'Descripción',	cell: (foda: any) => `${foda.foda_desc}`}
	];


	constructor(private _acceso: AccesoService,
				private _foda: FodaService) {
		this.tipo_user = _acceso.tipoUsuario();
	}

	ngOnInit() {
		this.cargando = true;
		// console.log(this.tipo_user);
		this.subscription = this._foda.getListadoFODA(this.tipo_user)
		.subscribe(
			data => {
					this.jsonData = data;
					this.listado = this.jsonData.listado;
					this._acceso.guardarStorage(this.jsonData.token);
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			// this.editarArea(datos.row);
		} else if (datos.accion === 'C') {
			// this.borrarArea(datos.row);
		} else if (datos.accion === 'V') {
		// this.openDialog(datos.row);
		}
	}

}
