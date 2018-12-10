import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogosService } from '../../../services/shared/catalogos.service';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-nivel-riesgo',
	templateUrl: './nivel-riesgo.component.html'
})

export class NivelRiesgoComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: false, administrar: false, insertar: false, editar: false, cancelar: false};
	ruta_add = [];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 				header: 'Clave',			cell: (cat: any) => `${cat.clave}`},
		{ columnDef: 'descripcion',			header: 'Descripción',		cell: (cat: any) => `${cat.descripcion}`},
		{ columnDef: 'tipo_accion_desc',	header: 'Tipo de Acción',	cell: (cat: any) => `${cat.tipo_accion_desc}`},
		{ columnDef: 'accion',				header: 'Acciones',			cell: (cat: any) => `${cat.accion}`}
	];

	constructor(public _acceso: AccesoService,
				public _catalogos: CatalogosService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._catalogos.getCatalogoService('NRI')
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
