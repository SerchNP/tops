import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogosService } from '../../../services/shared/catalogos.service';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Catalogo } from '../../../models/catalogo.model';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-formulas',
	templateUrl: './formulas.component.html'
})
export class FormulasComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: false, administrar: true, insertar: true, editar: true, cancelar: false};
	ruta_add = ['/administracion', 'submenucat', 'formulas_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 		header: 'Clave',			cell: (formula: any) => `${formula.clave}`},
		{ columnDef: 'descripcion', header: 'Descripción',		cell: (formula: any) => `${formula.descripcion}`},
		{ columnDef: 'f_captura',  	header: 'Fecha captura',	cell: (formula: any) => `${formula.f_captura}`},
		{ columnDef: 'u_captura',	header: 'Usuario captura',	cell: (formula: any) => `${formula.u_captura}`}
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarFormula(datos.row);
		}
	}

	async editarFormula(formula: Catalogo) {
		const {value: descripcion} = await swal({
			title: 'Actualizar descripción de la Fórmula',
			input: 'text',
			inputValue: formula.descripcion,
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			inputValidator: (value) => {
				return !value && 'Necesita ingresar la descripción de la fórmula';
			}
		});
		if (descripcion) {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: '¿Está seguro que desea actualizar la descripción de la fórmula "'
					+ formula.descripcion + '" por "' + descripcion.toUpperCase() + '"?',
				type: 'question',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const resultado_body = JSON.parse('{"clave": ' + formula.clave + ', "descrip": "' + descripcion.toUpperCase() + '", "accion" : "U"}');
				this.subscription = this._catalogosService.mantCatFormulas(resultado_body)
					.subscribe((data: any) => {
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._accesoService.logout();
						}
					});
			}
		}
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}
}
