import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogosService } from '../../../services/shared/catalogos.service';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component({
	selector: 'app-tresultados',
	templateUrl: './tresultados.component.html'
})
export class TResultadosComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: false, administrar: true, insertar: true, editar: true, cancelar: false};
	ruta_add = ['/administracion', 'resultados_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 		header: 'Clave',			cell: (tresultado: any) => `${tresultado.clave}`,	align: 'center'},
		{ columnDef: 'descripcion', header: 'Descripción',		cell: (tresultado: any) => `${tresultado.descripcion}`},
		{ columnDef: 'f_captura',  	header: 'Fecha captura',	cell: (tresultado: any) => `${tresultado.f_captura}`},
		{ columnDef: 'u_captura',	header: 'Usuario captura',	cell: (tresultado: any) => `${tresultado.u_captura}`}
	];

	constructor(public _catalogosService: CatalogosService,
				public _accesoService: AccesoService) {}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._catalogosService.getCatalogoService('FOR')
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
