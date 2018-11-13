import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, IndicadoresService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-autoriza-indicadores',
	templateUrl: './autoriza-indicadores.component.html'
})
export class AutorizaIndicadoresComponent implements OnInit, OnDestroy {
	private subscription: Subscription;

	cargando = true;
	listado: any[] = [];
	derechos: Derechos = {administrar: true, cancelar: true, editar: true, insertar: false};
	select = true;
	allowMultiSelect = true;
	accion: string;
	seleccionados: any[];
	cancelar: any[] = ['/indicadores', 'matriz_indicadores'];
	titulo: string;
	columns = [];

	constructor(private activatedRoute: ActivatedRoute,
				private _acceso: AccesoService,
				private router: Router,
				private _indicador: IndicadoresService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];

			if (this.accion === 'A') {
				this.titulo = 'Pendientes';
				this.derechos.editar = false; // Deshabilita la edicion en la autorizacion
				this.columns = [
					{ columnDef: 'proceso', 		 header: 'ID Proceso',		   align: 'center', cell: (indicador: any) => `${indicador.proceso}`},
					{ columnDef: 'proceso_desc', 	 header: 'Proceso',			   cell: (indicador: any) => `${indicador.proceso_desc}`},
					{ columnDef: 'indicador',     	 header: 'ID Indicador',   	   align: 'center', cell: (indicador: any) => `${indicador.indicador}`},
					{ columnDef: 'indicador_desc',	 header: 'Indicador',    	   cell: (indicador: any) => `${indicador.indicador_desc}`},
					{ columnDef: 'valor_meta',		 header: 'Meta (Valor)',        align: 'center', cell: (indicador: any) => `${indicador.valor_meta}`},
					{ columnDef: 'autoriza_desc',    header: 'Situación',		   cell: (indicador: any) => `${indicador.autoriza_desc}`},
					{ columnDef: 'motivo_cancela',	 header: 'Motivo Cancelación', cell: (indicador: any) => `${indicador.motivo_cancela}`},
					{ columnDef: 'tipo_desc',		 header: 'Tipo',   			   visible: false, cell: (indicador: any) => `${indicador.tipo_desc}`},
					{ columnDef: 'frecuencia_desc',  header: 'Frecuencia',		   visible: false, cell: (indicador: any) => `${indicador.frecuencia_desc}`},
					{ columnDef: 'formula_desc',	 header: 'Fórmula',   	 	   visible: false, cell: (indicador: any) => `${indicador.formula_desc}`},
					{ columnDef: 'resultado_desc',   header: 'Resultado',	       visible: false, cell: (indicador: any) => `${indicador.resultado_desc}`},
					{ columnDef: 'objetivo_desc',	 header: 'Objetivo Calidad',   visible: false, cell: (indicador: any) => `${indicador.objetivo_desc}`},
					{ columnDef: 'meta',			 header: 'Meta (Descripcion)', visible: false, cell: (indicador: any) => `${indicador.meta}`},
					{ columnDef: 'calculo',			 header: 'Cálculo',      	   visible: false, cell: (indicador: any) => `${indicador.calculo}`},
					// tslint:disable-next-line:max-line-length
					{ columnDef: 'puesto_resp_desc', header: 'Responsable',   	   visible: false, cell: (indicador: any) => `${indicador.puesto_resp_desc}`},
					{ columnDef: 'u_cancela',		 header: 'Usuario Cancela',	   visible: false, cell: (indicador: any) => `${indicador.u_cancela}`},
					{ columnDef: 'f_cancela',		 header: 'Fecha Cancela',	   visible: false, cell: (indicador: any) => `${indicador.f_cancela}`}
				];
			} else {
				this.titulo = 'Rechazados';
				this.columns = [
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
					{ columnDef: 'objetivo_desc',	 header: 'Objetivo Calidad',   visible: false, cell: (indicador: any) => `${indicador.objetivo_desc}`},
					{ columnDef: 'meta',			 header: 'Meta (Descripcion)', visible: false, cell: (indicador: any) => `${indicador.meta}`},
					{ columnDef: 'calculo',			 header: 'Cálculo',      	   visible: false, cell: (indicador: any) => `${indicador.calculo}`},
					// tslint:disable-next-line:max-line-length
					{ columnDef: 'puesto_resp_desc', header: 'Responsable',   	   visible: false, cell: (indicador: any) => `${indicador.puesto_resp_desc}`},
					{ columnDef: 'u_cancela',		 header: 'Usuario Cancela',	   visible: false, cell: (indicador: any) => `${indicador.u_cancela}`},
					{ columnDef: 'f_cancela',		 header: 'Fecha Cancela',	   visible: false, cell: (indicador: any) => `${indicador.f_cancela}`},
					{ columnDef: 'motivo_cancela',	 header: 'Motivo Cancelación', visible: false, cell: (indicador: any) => `${indicador.motivo_cancela}`},
					{ columnDef: 'u_rechaza',		 header: 'Usuario Rechaza',	   visible: false, cell: (indicador: any) => `${indicador.u_rechaza}`},
					{ columnDef: 'f_rechaza',		 header: 'Fecha Rechazo',	   visible: false, cell: (indicador: any) => `${indicador.f_rechaza}`}
				];
			}
		});
	}

	ngOnInit() {
		this.cargando = true;
		if (this.accion === 'A') {
			this.getPendientes();
		} else if (this.accion === 'R') {
			this.getRechazados();
		}
		this.cargando = false;
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	detectarRegistros(rows): void {
		this.seleccionados = rows;
	}

	getPendientes() {
		this.subscription = this._indicador.getIndicadoresPendientes()
			.subscribe(
				(data: any) => {
					this.listado = data.pendientes;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				}
			);
	}

	getRechazados() {
		this.subscription = this._indicador.getIndicadoresRechazados()
			.subscribe(
				(data: any) => {
					this.listado = data.rechazados;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				}
			);
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			if (this.accion === 'A') {
				this.rechazarIndicador(datos.row);
			} else if (this.accion === 'R') {
				this.cancelaRechazoIndicador(datos.row);
			}
		} else if (datos.accion === 'E' && this.accion === 'R') {
			// Manda el form en modo <edicion> con origen <Rechazo>
			this.router.navigate(['/indicadores', 'indicador_form', 'U', datos.row.indicador, datos.row.autoriza, this.accion]);
		}
	}

	guardar() {
		if (this.seleccionados === undefined || this.seleccionados.length === 0) {
			swal('Atención!!!', 'Debe seleccionar al menos un registro.', 'error');
		} else {
			const arreglo: any[] = [];
			this.seleccionados.forEach(element => {
				arreglo.push(JSON.parse('{"proceso" : ' + element['proceso'] + ', "indicador" : ' + element['indicador'] + '}'));
			});
			if (this.accion === 'A') {
				this.subscription = this._indicador.autorizarIndicadores(arreglo)
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
			} else if (this.accion === 'R') {
				this.subscription = this._indicador.reautorizarIndicadores(arreglo)
					.subscribe(
						(data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
							}
						}
					);
			}
		}
	}

	async rechazarIndicador (registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea rechazar '
				+ ((registro.autoriza === '6' || registro.autoriza === '8') ? 'la cancelación del' : 'el') + ' indicador?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el motivo de rechazo',
				input: 'textarea',
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el motivo de rechazo';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._indicador.rechazarIndicador(registro.indicador, motivo.toUpperCase())
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

	async cancelaRechazoIndicador(registro: any) {
		const { value: respuesta } = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea '
				+ ((registro.autoriza === 4) ? 'deshacer la Cancelación del' : 'cancelar el')
				+ ' indicador "' + registro.indicador_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			if (registro.autoriza === 4) {
				// Cuando es CANCELACIÓN RECHAZADA y se 'rechaza' se AUTORIZA nuevamente
				this.subscription = this._indicador.rechazarIndicador(registro.indicador, '')
					.subscribe(
						(data: any) => {
							this._acceso.guardarStorage(data.token);
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
							}
						}
					);
			} else if (registro.autoriza === 5) {
				// Cuando está RECHAZADO y se 'rechaza'
				// Se elimina de la tabla, siempre y cuando no se trate de un cambio de lo ya autorizado
				this.subscription = this._indicador.cancelarIndicador(registro.indicador, '')
					.subscribe(
						(data: any) => {
							this._acceso.guardarStorage(data.token);
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
							}
						}
					);
			}
		}
	}
}
