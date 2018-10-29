import { Component, OnInit, OnDestroy } from '@angular/core';
import { Derechos } from '../../../interfaces/derechos.interface';
import { CatalogosService } from '../../../services/shared/catalogos.service';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-frecuencia-medicion',
	templateUrl: './frecuencia-medicion.component.html',
	styles: []
})
export class FrecuenciaMedicionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: false, administrar: true, insertar: true, editar: true, cancelar: false};
	ruta_add = ['/administracion', 'frecuencias_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 		header: 'Clave',			cell: (frec: any) => `${frec.clave}`,	align: 'center'},
		{ columnDef: 'descripcion', header: 'Descripción',		cell: (frec: any) => `${frec.descripcion}`},
		{ columnDef: 'f_captura',  	header: 'Fecha captura',	cell: (frec: any) => `${frec.f_captura}`},
		{ columnDef: 'u_captura',	header: 'Usuario captura',	cell: (frec: any) => `${frec.u_captura}`}
	];

	constructor(public _catalogosService: CatalogosService,
				public _accesoService: AccesoService) {}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._catalogosService.getCatalogoService('FRE')
			.subscribe(
				(data: any) => {
					this.listado = data.catalogo;
					this._accesoService.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

}
