import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { IndicadoresService, AreasService } from '../../../services/services.index';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component ({
	selector: 'app-indicador-area',
	templateUrl: './indicador-area.component.html'
})
export class IndicadorAreaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {administrar: true, editar: true, cancelar: true, insertar: true};
	ruta_add =  ['/indicadores', 'indicador_form', 'I', 0];
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
				private _areas: AreasService,
				public dialog: MatDialog) {
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._indicadorService.getIndicadoresUAP('indicador_area')
		// this.subscription = this._areas.getAreas()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.indicadores;
					this._accesoService.guardarStorage(this.jsonData.token);
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
			// this.cancelar(datos.row);
		} if (datos.accion === 'E') {
			// this.cancelar(datos.row);
		} else if (datos.accion === 'V') {
			// this.openDialog(datos.row);
		}
	}

	/*async cancelar(indicador: any) {
		if (indicador.autoriza === 7) {
			swal('ERROR', 'El indicador ya se encuentra cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el indicador ' + indicador.indicador_desc + ' del proceso ' + indicador.proceso_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._indicadorService.cancelaAreaAsignada(areaPproceso.clave, motivo.toUpperCase())
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
	}*/

	openDialog(datos: any): void {
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
	}

}
