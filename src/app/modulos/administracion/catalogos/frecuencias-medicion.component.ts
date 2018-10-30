import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogosService } from '../../../services/shared/catalogos.service';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Catalogo } from '../../../models/catalogo.model';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-frecuencias-medicion',
	templateUrl: './frecuencias-medicion.component.html'
})
export class FrecuenciasMedicionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: false, administrar: true, insertar: true, editar: true, cancelar: false};
	ruta_add = ['/administracion', 'frecuencias_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 		 header: 'Clave',			cell: (frecuencia: Catalogo) => `${frecuencia.clave}`},
		{ columnDef: 'descripcion',  header: 'Descripción',		cell: (frecuencia: Catalogo) => `${frecuencia.descripcion}`},
		{ columnDef: 'tipo_periodo', header: 'Tipo Periodo',	cell: (frecuencia: Catalogo) => `${frecuencia.tipo_periodo}`},
		{ columnDef: 'f_captura',  	 header: 'Fecha captura',	cell: (frecuencia: Catalogo) => `${frecuencia.f_captura}`},
		{ columnDef: 'u_captura',	 header: 'Usuario captura',	cell: (frecuencia: Catalogo) => `${frecuencia.u_captura}`}
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarfrecuencia(datos.row);
		}
	}

	async editarfrecuencia(frecuencia: Catalogo) {
		const {value: formValues} = await swal({
			titleText: 'Actualizar datos de la Frecuencia de medición',
			html:
				// tslint:disable-next-line:max-line-length
				'<div class="form-group"><label for="swal-input1" class="row col"><h5>Descripción</h5></label><input id="swal-input1" class="form-control" value="' + frecuencia.descripcion + '"></div>' +
				// tslint:disable-next-line:max-line-length
				'<div class="form-group"><label for="swal-input2" class="row col"><h5>Tipo Periodo</h5></label><input id="swal-input2" class="form-control" value="' + frecuencia.tipo_periodo + '"></div>',
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
			if (formValues[0] === '' || formValues[1] === '') {
				validar = false;
			}
			if (validar) {
				const {value: respuesta} = await swal({
					title: 'Atención!!!',
					text: '¿Está seguro que desea actualizar la descripción de la frecuencia de medición "'
						+ frecuencia.descripcion + '" por "' + formValues[0].toUpperCase() + '" y el tipo periodo "'
						+ frecuencia.tipo_periodo + '" por "' + formValues[1].toUpperCase() + '"?',
					type: 'question',
					showCancelButton: true,
					confirmButtonText: 'Aceptar',
					confirmButtonColor: '#B22222'
				});
				if (respuesta) {
					this.subscription = this._catalogosService
						.editaDescFrecuencia(frecuencia.clave, formValues[0].toUpperCase(), formValues[1].toUpperCase())
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
			} else {
				swal('ERROR', 'Debe ingresar todos los datos de la frecuencia de medición', 'error');
			}
		}
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}
}
