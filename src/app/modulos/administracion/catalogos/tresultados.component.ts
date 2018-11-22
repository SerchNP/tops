import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogosService } from '../../../services/shared/catalogos.service';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Catalogo } from '../../../models/catalogo.model';
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
	ruta_add = ['/administracion', 'submenucat', 'tresultados_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 		header: 'Clave',			cell: (tresultado: any) => `${tresultado.clave}`,	align: 'center'},
		{ columnDef: 'descripcion', header: 'Descripción',		cell: (tresultado: any) => `${tresultado.descripcion}`},
		{ columnDef: 'simbolo',		header: 'Símbolo',			cell: (tresultado: any) => `${tresultado.simbolo}`},
		{ columnDef: 'f_captura',  	header: 'Fecha captura',	cell: (tresultado: any) => `${tresultado.f_captura}`},
		{ columnDef: 'u_captura',	header: 'Usuario captura',	cell: (tresultado: any) => `${tresultado.u_captura}`}
	];

	constructor(public _catalogos: CatalogosService,
				public _acceso: AccesoService) {}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._catalogos.getCatalogoService('RES')
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
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarResultado(datos.row);
		}
	}

	async editarResultado(resultado: any) {
		const {value: formValues} = await swal({
			titleText: 'Actualizar datos del tipo de resultado de medición',
			html:
				// tslint:disable-next-line:max-line-length
				'<div class="form-group"><label for="swal-input1" class="row col"><h5>Tipo Periodo</h5></label><input id="swal-input1" class="form-control" value="' + resultado.descripcion + '"></div>' +
				// tslint:disable-next-line:max-line-length
				'<div class="form-group"><label for="swal-input2" class="row col"><h5>Símbolo</h5></label><input id="swal-input2" class="form-control" value="' + resultado.simbolo + '"></div>',
			focusConfirm: false,
			preConfirm: () => {
				return [
					(<HTMLInputElement>document.getElementById('swal-input1')).value,
					(<HTMLInputElement>document.getElementById('swal-input2')).value
				];
			},
			showCancelButton: true,
			confirmButtonText: 'Aceptar'
		});
		if (formValues) {
			let validar = true;
			if (formValues[0] === '') {
				validar = false;
			}
			if (validar) {
				const {value: respuesta} = await swal({
					title: 'Atención!!!',
					text: '¿Está seguro que desea actualizar la descripción del tipo de resultado de medición "'
						+ resultado.descripcion + '" por "' + formValues[0].toUpperCase() + ' y el símbolo "'
						+ resultado.simbolo + '" por "' + formValues[1].toLowerCase() + '"?',
					type: 'question',
					showCancelButton: true,
					confirmButtonText: 'Aceptar',
					confirmButtonColor: '#B22222'
				});
				if (respuesta) {
					const resultado_body = JSON.parse('{"clave": ' + resultado.clave + ', "descrip": "' + formValues[0].toUpperCase() + '", "simbolo": "' + formValues[1].toLowerCase() + '", "accion" : "U"}');
					this.subscription = this._catalogos
						.mantCatResultados(resultado_body)
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
			} else {
				swal('ERROR', 'Debe ingresar todos los datos del tipo de resultado de medición', 'error');
			}
		}
	}

}
