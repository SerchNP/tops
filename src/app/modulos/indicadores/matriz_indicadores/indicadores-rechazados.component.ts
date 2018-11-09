import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, IndicadoresService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-indicadores-rechazados',
	templateUrl: './indicadores-rechazados.component.html'
})
export class IndicadoresRechazadosComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando = true;
	listado: any[] = [];
	derechos: Derechos = {administrar: true, cancelar: true, editar: true, insertar: false};
	select = true;
	allowMultiSelect = true;
	accion = 'R';
	seleccionados: any[];
	cancelar: any[] = ['/indicadores', 'matriz_indicadores'];

	columns = [
		{ columnDef: 'proceso', 		 header: 'ID Proceso',		   align: 'center', cell: (indicador: any) => `${indicador.proceso}`},
		{ columnDef: 'proceso_desc', 	 header: 'Proceso',			   cell: (indicador: any) => `${indicador.proceso_desc}`},
		{ columnDef: 'indicador',     	 header: 'ID Indicador',   	   align: 'center', cell: (indicador: any) => `${indicador.indicador}`},
		{ columnDef: 'indicador_desc',	 header: 'Indicador',    	   cell: (indicador: any) => `${indicador.indicador_desc}`},
		{ columnDef: 'valor_meta',		 header: 'Meta (Valor)',        align: 'center', cell: (indicador: any) => `${indicador.valor_meta}`},
		{ columnDef: 'autoriza_desc',    header: 'Situación',		   cell: (indicador: any) => `${indicador.autoriza_desc}`},
		{ columnDef: 'motivo_rechaza',	 header: 'Motivo Rechazo',	   cell: (indicador: any) => `${indicador.motivo_rechaza}`},
		{ columnDef: 'tipo_desc',		 header: 'Tipo',   			   visible: false, cell: (indicador: any) => `${indicador.tipo_desc}`},
		{ columnDef: 'frecuencia_desc',  header: 'Frecuencia',		   visible: false, cell: (indicador: any) => `${indicador.frecuencia_desc}`},
		{ columnDef: 'formula_desc',	 header: 'Fórmula',   	 	   visible: false, cell: (indicador: any) => `${indicador.formula_desc}`},
		{ columnDef: 'resultado_desc',   header: 'Resultado',	       visible: false, cell: (indicador: any) => `${indicador.resultado_desc}`},
		{ columnDef: 'objetivo_desc',	 header: 'Objetivo Calidad',    visible: false, cell: (indicador: any) => `${indicador.objetivo_desc}`},
		{ columnDef: 'meta',			 header: 'Meta (Descripcion)',  visible: false, cell: (indicador: any) => `${indicador.meta}`},
		{ columnDef: 'calculo',			 header: 'Cálculo',      	   visible: false, cell: (indicador: any) => `${indicador.calculo}`},
		{ columnDef: 'puesto_resp_desc', header: 'Responsable',   	   visible: false, cell: (indicador: any) => `${indicador.puesto_resp_desc}`},
		{ columnDef: 'u_cancela',		 header: 'Usuario Cancela',	   visible: false, cell: (indicador: any) => `${indicador.u_cancela}`},
		{ columnDef: 'f_cancela',		 header: 'Fecha Cancela',	   visible: false, cell: (indicador: any) => `${indicador.f_cancela}`},
		{ columnDef: 'motivo_cancela',	 header: 'Motivo Cancelación',  visible: false, cell: (indicador: any) => `${indicador.motivo_cancela}`},
		{ columnDef: 'u_rechaza',		 header: 'Usuario Rechaza',	   visible: false, cell: (indicador: any) => `${indicador.u_rechaza}`},
		{ columnDef: 'f_rechaza',		 header: 'Fecha Rechazo',	   visible: false, cell: (indicador: any) => `${indicador.f_rechaza}`}
	];

	constructor(private activatedRoute: ActivatedRoute,
				private _acceso: AccesoService,
				private router: Router,
				private _indicador: IndicadoresService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._indicador.getIndicadoresRechazados('matriz_indicadores')
			.subscribe(
				(data: any) => {
					this.listado = data.rechazados;
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

	detectarRegistros(rows): void {
		console.log(rows);
		this.seleccionados = rows;
	}

	guardar() {
		if (this.seleccionados === undefined || this.seleccionados.length === 0) {
			swal('Atención!!!', 'Debe seleccionar al menos un registro.', 'error');
		} else {
			const arreglo: any[] = [];
			this.seleccionados.forEach(element => {
				arreglo.push(JSON.parse('{"proceso" : ' + element['proceso'] + ', "indicador" : ' + element['indicador'] + '}'));
			});
			this.subscription = this._indicador.reautorizarIndicadores(arreglo)
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.rechazarIndicador(datos.row);
		} else if (datos.accion === 'E') {
			// Manda el estatus PENDIENTE para que permita la edición
			this.router.navigate(['/indicadores', 'indicador_form', 'U', datos.row.indicador, datos.row.autoriza, 'R']);
		}
	}

	async rechazarIndicador(registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: 'Está seguro que desea rechazar ' + registro.accion + ' del indicador "' + registro.indicador_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			if (registro.autoriza === 4) {
				// Cuando esta CANCELACIÓN RECHAZADA y se "rechaza" se AUTORIZA nuevamente
				this.subscription = this._indicador.rechazarIndicador(registro.indicador, '')
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			} else if (registro.autoriza === 5) {
				// Cuando está RECHAZADO y se "rechaza"
				// Se elimina de la tabla, siempre y cuando no se trate de un cambio sobre lo ya autorizado
				this.subscription = this._indicador.cancelarIndicador(registro.indicador, '')
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
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
