import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService, CatalogosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-acciones',
	templateUrl: './acciones.component.html'
})

export class AccionesComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: false, administrar: false, insertar: false, editar: false, cancelar: false};
	ruta_add = [];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 		header: 'Clave',		cell: (accion: any) => `${accion.clave}`},
		{ columnDef: 'descripcion',	header: 'Descripción',	cell: (accion: any) => `${accion.descripcion}`}
	];

	constructor(public _acceso: AccesoService,
				public _catalogos: CatalogosService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._catalogos.getCatalogoService('ARI')
			.subscribe(
				(data: any) => {
					this.listado = data.catalogo;
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

}
