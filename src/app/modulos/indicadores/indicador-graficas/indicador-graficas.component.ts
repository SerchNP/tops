import { Component, OnInit, OnDestroy } from '@angular/core';
import { IndicadoresService, AccesoService, DerechosService } from '../../../services/services.index';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Indicador } from '../../../interfaces/indicador.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-indicador-graficas',
	templateUrl: './indicador-graficas.component.html'
})
export class IndicadorGraficasComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	indicadorID: number;
	registro: Indicador = {};
	listado: any[] = [];
	cargando = false;
	titulo: string;
	insertar: boolean;
	cancelar = ['/indicadores', 'matriz_indicadores'];
	select = false;
	allowMultiSelect = false;
	derechos: Derechos = {};

	columns = [
		{ columnDef: 'frecuencia_desc', header: 'Frecuencia',      cell: (medicion: any) => `${medicion.frecuencia_desc}`},
		{ columnDef: 'formula_desc', 	header: 'Formula',    	   cell: (medicion: any) => `${medicion.formula_desc}`},
		{ columnDef: 'f_inicial', 		header: 'Fecha inicial',   cell: (medicion: any) => `${medicion.f_inicial}`},
		{ columnDef: 'f_final',   		header: 'Fecha final',     cell: (medicion: any) => `${medicion.f_final}`},
		{ columnDef: 'meta', 			header: 'Meta',  		   cell: (medicion: any) => `${medicion.meta}`},
		{ columnDef: 'medicion',   		header: 'Medicion',        cell: (medicion: any) => `${medicion.medicion}`},
		{ columnDef: 'u_captura',   	header: 'Usuario captura', visible: false, cell: (medicion: any) => `${medicion.u_captura}`},
		{ columnDef: 'f_captura',   	header: 'Fecha captura',   visible: false, cell: (medicion: any) => `${medicion.f_captura}`}
	];

	constructor(private activatedRoute: ActivatedRoute,
				public _derechos: DerechosService,
				private _indicadores: IndicadoresService,
				private _acceso: AccesoService,
				private router: Router,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.indicadorID = params['id'];
		});
		if (this.indicadorID !== 0) {
			this.cargarIndicador(this.indicadorID);
		}
	}

	ngOnInit() {
		this.cargando = true;
		this.derechos = JSON.parse(localStorage.getItem('actionsMI'));
		this.insertar = this.derechos.insertar;
		this.derechos.consultar = false;
		this.derechos.insertar = false;
		this.derechos.editar = false;
		this.subscription = this._indicadores.getMedicionesIndicador(this.indicadorID)
			.subscribe(
				(data: any) => {
					this.listado = data.mediciones;
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
		localStorage.removeItem('actionsMI');
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	cargarIndicador(indicadorID: number) {
		this.subscription = this._indicadores.getIndicadorById(indicadorID)
			.subscribe(
				(data: any) => {
					this.registro = data.indicador;
					this.titulo = data.indicador.indicador_desc;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	async agregarMedicion() {
		const {value: formValues} = await swal({
			titleText: 'Ingresar medición al indicador',
			html:
				'<div class="form-group"><input type="date" id="swal-date1" class="form-control" placeHolder="Fecha inicial"></div>' +
				'<div class="form-group"><input type="date" id="swal-date2" class="form-control" placeHolder="Fecha final"></div>' +
				'<div class="form-group"><input type="number" id="swal-valor" class="form-control" placeHolder="Valor de la medición"></div>',
			focusConfirm: false,
			preConfirm: () => {
				return [
					(<HTMLInputElement>document.getElementById('swal-date1')).value,
					(<HTMLInputElement>document.getElementById('swal-date2')).value,
					(<HTMLInputElement>document.getElementById('swal-valor')).value
				];
			},
			showCancelButton: true,
			confirmButtonText: 'Aceptar'
		});
		if (formValues) {
			let validar = true;
			if (formValues[0] === '' || formValues[1] === '' || formValues[2] === '') {
				validar = false;
			}
			if (validar) {
				this.subscription = this._indicadores
					.insertarMedicionIndicador(this.indicadorID, formValues[0], formValues[1], formValues[2])
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
			} else {
				swal('ERROR', 'Debe ingresar todos los datos de la medición', 'error');
			}
		}
	}

	async cancelarMedicion(medicion: any) {
		if (medicion.autoriza === 7) {
			swal('ERROR', 'La medición ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				// tslint:disable-next-line:max-line-length
				text: '¿Está seguro que desea cancelar la medición?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación',
					input: 'textarea',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._indicadores.cancelarMedicionIndicador(medicion.indicador, medicion.regid, motivo.toUpperCase())
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
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.cancelarMedicion(datos.row);
		} else if (datos.accion === 'V') {
			// this.openDialog(datos.row);
		}
	}

}
