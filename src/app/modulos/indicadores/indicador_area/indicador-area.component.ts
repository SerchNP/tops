import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { IndicadoresService } from '../../../services/services.index';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component ({
	selector: 'app-indicador-area',
	templateUrl: './indicador-area.component.html'
})
export class IndicadorAreaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {administrar: true, editar: true, cancelar: true, insertar: true};
	ruta_add =  ['/indicadores', 'indicador_area_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'proceso',     	 header: 'ID Proceso',   	 align: 'center', cell: (indicador: any) => `${indicador.proceso}`},
		{ columnDef: 'proceso_desc',   	 header: 'Proceso', 	     cell: (indicador: any) => `${indicador.proceso_desc}`},
		{ columnDef: 'indicador', 		 header: 'Clave', 	    	 align: 'center', cell: (indicador: any) => `${indicador.indicador}`},
		{ columnDef: 'indicador_desc',	 header: 'Indicador',    	 cell: (indicador: any) => `${indicador.indicador_desc}`},
		{ columnDef: 'tipo_desc',  		 header: 'Tipo Indicador',	 cell: (indicador: any) => `${indicador.tipo_desc}`},
		{ columnDef: 'frecuencia_desc',  header: 'Frecuencia',		 cell: (indicador: any) => `${indicador.frecuencia_desc}`},
		{ columnDef: 't_formula_desc',	 header: 'Cálculo',   	 	 cell: (indicador: any) => `${indicador.t_formula_desc}`},
		{ columnDef: 't_resultado_desc', header: 'Resultado',	     cell: (indicador: any) => `${indicador.t_resultado_desc}`},
		{ columnDef: 'autoriza_desc', 	 header: 'Situación',		 cell: (indicador: any) => `${indicador.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	 header: 'Estatus',			 cell: (indicador: any) => `${indicador.estatus_desc}`},
		{ columnDef: 'meta',			 header: 'Meta',  	    	 visible: false, cell: (indicador: any) => `${indicador.meta}`},
		{ columnDef: 'formula',			 header: 'Fórmula',      	 visible: false, cell: (indicador: any) => `${indicador.formula}`},
		{ columnDef: 'objetivo_desc',	 header: 'Objetivo Calidad', visible: false, cell: (indicador: any) => `${indicador.objetivo_desc}`}
	];

	constructor(private _accesoService: AccesoService,
				private _indicadorService: IndicadoresService,
				private router: Router,
				public dialog: MatDialog) {
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._indicadorService.getIndicadoresUAP('indicador_area')
			.subscribe(
				(data: any) => {
					this.listado = data.indicadores;
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.cancelarIndicador(datos.row);
		} if (datos.accion === 'E') {
			this.editarIndicador(datos.row);
		} else if (datos.accion === 'V') {
			// this.openDialog(datos.row);
		}
	}

	editarIndicador(indicador) {
		if (indicador.autoriza === 7) {
			swal('ERROR', 'No es posible modificar, el indicador ya se encuentra cancelado', 'error');
		} else {
			this.router.navigate(['/indicadores', 'indicador_area_form', 'U', indicador.indicador]);
		}
	}

	async cancelarIndicador(indicador: any) {
		if (indicador.autoriza === 7) {
			swal('ERROR', 'El indicador ya se encuentra cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				// tslint:disable-next-line:max-line-length
				text: 'Está seguro que desea cancelar el indicador   >>> ' + indicador.indicador_desc + ' <<<   del proceso ' + indicador.proceso_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				if (indicador.autoriza === 1) {
					// Si esta capturado, se borra, por lo que no se pedirá el motivo
					this.subscription = this._indicadorService.cancelarIndicador(indicador.indicador, '')
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
				} else {
					const {value: motivo} = await swal({
						title: 'Ingrese el motivo de cancelación',
						input: 'text',
						showCancelButton: true,
						inputValidator: (value) => {
							return !value && 'Necesita ingresar el motivo de cancelación';
						}
					});
					if (motivo !== undefined) {
						this.subscription = this._indicadorService.cancelarIndicador(indicador.indicador, motivo.toUpperCase())
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
		}
	}

	/*openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: datos.indicador_desc,
				situacion: datos.autoriza_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica,
				u_cancela: datos.u_cancela,
				f_cancela: datos.f_cancela,
				motivo_cancela: datos.motivo_cancela
			}
		});
	}*/

}
