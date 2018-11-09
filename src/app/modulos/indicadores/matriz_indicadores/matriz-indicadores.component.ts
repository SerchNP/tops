import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService } from '../../../services/shared/acceso.service';
import { Derechos } from '../../../interfaces/derechos.interface';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { IndicadoresService, DerechosService } from '../../../services/services.index';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component ({
	selector: 'app-matriz-indicadores',
	templateUrl: './matriz-indicadores.component.html'
})
export class MatrizIndicadoresComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	menu = 'matriz_indicadores';
	ruta_add =  ['/indicadores', 'indicador_form', 'I', 0, 0, 'M'];
	ruta_rechazos = ['/indicadores', 'indicadores_rechazados_form'];
	select = false;
	allowMultiSelect = false;
	derechos: Derechos = {};
	aviso_r = 0;

	columns = [
		{ columnDef: 'proceso',     	 header: 'ID Proceso',   	   align: 'center', cell: (indicador: any) => `${indicador.proceso}`},
		{ columnDef: 'proceso_desc',   	 header: 'Proceso', 	       cell: (indicador: any) => `${indicador.proceso_desc}`},
		{ columnDef: 'tipo_desc',  		 header: 'Tipo',	   		   cell: (indicador: any) => `${indicador.tipo_desc}`},
		{ columnDef: 'indicador', 		 header: 'Clave', 	    	   align: 'center', cell: (indicador: any) => `${indicador.indicador}`},
		{ columnDef: 'indicador_desc',	 header: 'Indicador',    	   cell: (indicador: any) => `${indicador.indicador_desc}`},
		{ columnDef: 'valor_meta',		 header: 'Meta (Valor)',       align: 'center', cell: (indicador: any) => `${indicador.valor_meta}`},
		{ columnDef: 'frecuencia_desc',  header: 'Frecuencia',		   cell: (indicador: any) => `${indicador.frecuencia_desc}`},
		{ columnDef: 'formula_desc',	 header: 'Fórmula',   	 	   visible: false, cell: (indicador: any) => `${indicador.formula_desc}`},
		{ columnDef: 'resultado_desc',   header: 'Resultado',	       visible: false, cell: (indicador: any) => `${indicador.resultado_desc}`},
		{ columnDef: 'autoriza_desc', 	 header: 'Situación',		   cell: (indicador: any) => `${indicador.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	 header: 'Estatus',			   cell: (indicador: any) => `${indicador.estatus_desc}`},
		{ columnDef: 'meta',			 header: 'Meta (Descripcion)', visible: false, cell: (indicador: any) => `${indicador.meta}`},
		{ columnDef: 'calculo',			 header: 'Cálculo',      	   visible: false, cell: (indicador: any) => `${indicador.calculo}`},
		{ columnDef: 'objetivo_desc',	 header: 'Objetivo Calidad',   visible: false, cell: (indicador: any) => `${indicador.objetivo_desc}`},
		{ columnDef: 'puesto_resp_desc', header: 'Responsable',   	   visible: false, cell: (indicador: any) => `${indicador.puesto_resp_desc}`}
	];

	constructor(private _acceso: AccesoService,
				private _indicador: IndicadoresService,
				public _derechos: DerechosService,
				private router: Router,
				public dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.getAviso();
		this.subscription = this._indicador.getMatrizIndicadores(this.menu)
			.subscribe(
				(data: any) => {
					this.listado = data.indicadores;
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
		if (datos.accion === 'C') {
			this.cancelarIndicador(datos.row);
		} if (datos.accion === 'E') {
			this.editarIndicador(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		} else if (datos.accion === 'A') {
			this.autorizarIndicador(datos.row);
		} else if (datos.accion === 'G') {
			this.graficasIndicador(datos.row);
		}
	}

	getAviso() {
		this.subscription = this._indicador.getAvisoMatrizIndicadores(this.menu)
		.subscribe(
			(data: any) => {
				this.aviso_r = data.aviso[0].rechazados;
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

	getDerechos() {
		this._derechos.getDerechosGlobalMenuPromesa(this.menu).then((data: any) => {
			this.derechos = data;
			this._derechos.PRIVILEGIOS = data;
			localStorage.setItem('actionsMI', JSON.stringify(this.derechos));
		}).catch(error => {
			console.log(error);
		});
	}

	autorizarIndicador(indicador) {
		if (indicador.pendiente === 'N') {
			swal('ERROR', 'No es posible autorizar/rechazar el indicador', 'error');
		} else {
			this.router.navigate(['/indicadores', 'indicador_form', 'A', indicador.indicador, indicador.autoriza, 'M']);
		}
	}

	async cancelarIndicador(indicador: any) {
		if (indicador.autoriza === 7) {
			swal('ERROR', 'El indicador ya se encuentra cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				// tslint:disable-next-line:max-line-length
				text: 'Está seguro que desea cancelar el indicador "' + indicador.indicador_desc + '" del proceso ' + indicador.proceso_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				if (indicador.autoriza === 1) {
					// Si esta capturado, se borra, por lo que no se pedirá el motivo
					this.subscription = this._indicador.cancelarIndicador(indicador.indicador, '')
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
					const {value: motivo} = await swal({
						title: 'Ingrese el motivo de cancelación',
						input: 'textarea',
						showCancelButton: true,
						inputValidator: (value) => {
							return !value && 'Necesita ingresar el motivo de cancelación';
						}
					});
					if (motivo !== undefined) {
						this.subscription = this._indicador.cancelarIndicador(indicador.indicador, motivo.toUpperCase())
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
	}

	editarIndicador(indicador) {
		if (indicador.autoriza === 7) {
			swal('ERROR', 'No es posible modificar, el indicador ya se encuentra cancelado', 'error');
		} else {
			this.router.navigate(['/indicadores', 'indicador_form', 'U', indicador.indicador, indicador.autoriza, 'M']);
		}
	}

	graficasIndicador(indicador) {
		if (indicador.autoriza !== 7 && indicador.autoriza !== 3) {
			swal('ERROR', 'No es posible visualizar gráficas, el indicador no es válido', 'error');
		} else {
			this.router.navigate(['/indicadores', 'indicador_graficas', indicador.indicador]);
		}
	}

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
