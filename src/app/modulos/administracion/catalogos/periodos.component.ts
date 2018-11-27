import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService, CatalogosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-periodos',
	templateUrl: './periodos.component.html'
})

export class PeriodosComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: false, administrar: true, insertar: true, editar: true, cancelar: false};
	ruta_add = ['/administracion', 'submenucat', 'periodos_form'];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'periodo',		header: 'Clave del Periodo',						cell: (formula: any) => `${formula.periodo}`},
		{ columnDef: 'anio',		header: 'Año',										cell: (formula: any) => `${formula.anio}`},
		{ columnDef: 'f_inicial',  	header: 'Fecha Inicial',							cell: (formula: any) => `${formula.f_inicial}`},
		{ columnDef: 'f_final',		header: 'Fecha Final',								cell: (formula: any) => `${formula.f_final}`},
		{ columnDef: 'estatus',		header: 'Estatus',									cell: (formula: any) => `${formula.estatus}`},
		{ columnDef: 'f_captura',	header: 'Fecha Captura',		visible: false,		cell: (formula: any) => `${formula.f_captura}`},
		{ columnDef: 'usu_captura',	header: 'Usuario Captura',		visible: false, 	cell: (formula: any) => `${formula.usu_captura}`}
	];

	constructor(private router: Router, private _acceso: AccesoService, private _catalogos: CatalogosService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._catalogos.getCatalogoService('PER')
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
			this.editarPeriodo(datos.row);
		}
	}

	async editarPeriodo(periodo: any) {
		let pregunta = '';
		if (periodo.estatus === 'CERRADO') {
			pregunta = 'ABRIR';
		} else {
			pregunta = 'CERRAR';
		}

		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea ' + pregunta + ' el periodo "'
				+ periodo.periodo + '" con fechas del ' + periodo.f_inicial
				+ ' al ' + periodo.f_final + '?',
			type: 'question',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			this.subscription = this._catalogos.abrirCerrarPeriodos(periodo.periodo)
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
	}

}
