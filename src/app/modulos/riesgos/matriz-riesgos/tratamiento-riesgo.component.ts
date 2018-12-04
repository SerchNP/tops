import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RiesgoService, AccesoService, DerechosService } from '../../../services/services.index';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { MatDialog } from '@angular/material';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-tratamiento-riesgo',
	templateUrl: './tratamiento-riesgo.component.html'
})
export class TratamientoRiesgoComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'matriz_riesgos';

	riesgoID: number;
	registro: any = {};
	cargando = false;
	titulo: string;
	cancelar = ['/riesgos', 'matriz_riesgos'];
	ruta_addM: any [];
	ruta_addA: any [];
	select = false;
	allowMultiSelect = false;
	derechos: Derechos = {};
	derechosM: Derechos = {};
	derechosA: Derechos = {};
	accion: string;

	listadoMediciones: any [] = [];
	listadoAcciones: any [] = [];

	columnsM = [
		{ columnDef: 'fecha_evalua_t',   header: 'Fecha Evaluación', align: 'center', cell: (medicionR: any) => `${medicionR.fecha_evalua_t}`},
		{ columnDef: 'ocurre_desc',      header: 'PF', 			align: 'center', cell: (medicionR: any) => `${medicionR.ocurre_desc}`},
		{ columnDef: 'valorc_o',     	 header: 'Valor CPF', 	cell: (medicionR: any) => `${medicionR.valorc_o}`},
		{ columnDef: 'impacto_desc',     header: 'Impacto', 	cell: (medicionR: any) => `${medicionR.impacto_desc}`},
		{ columnDef: 'valorc_i',     	 header: 'Valor CI', 	cell: (medicionR: any) => `${medicionR.valorc_i}`},
		{ columnDef: 'valorc_total',     header: 'Valor CPT', 	cell: (medicionR: any) => `${medicionR.valorc_total}`},
		{ columnDef: 'valor_compara',    header: 'Valor RR', 	align: 'center', cell: (medicionR: any) => `${medicionR.valor_compara}`},
		{ columnDef: 'cm_desc',     	 header: 'Valor CM', 	align: 'center', cell: (medicionR: any) => `${medicionR.cm_desc}`},
		// tslint:disable-next-line:max-line-length
		{ columnDef: 'nivel_desc',     	 header: 'Nivel de Riesgo',    color: true, align: 'center', cell: (medicionR: any) => `${medicionR.nivel_desc}`},
		{ columnDef: 'tipo_accion_desc', header: 'Acción',	           cell: (medicionR: any) => `${medicionR.tipo_accion_desc}`},
		{ columnDef: 'impacto_texto', 	 header: 'Impacto del Riesgo', visible: false, cell: (medicionR: any) => `${medicionR.impacto_texto}`},
		{ columnDef: 'accion', 			 header: 'Acción a Tomar', 	   visible: false, cell: (medicionR: any) => `${medicionR.accion}` }
	];

	columnsA = [
		{ columnDef: 'accion_desc',        header: 'Acción',			cell: (accionR: any) => `${accionR.accion_desc}`},
		{ columnDef: 'f_inicio_t',     	   header: 'Fecha de Inicio',	cell: (accionR: any) => `${accionR.f_inicio_t}`},
		{ columnDef: 'responsable',        header: 'Responsable',		cell: (accionR: any) => `${accionR.responsable}`},
		{ columnDef: 'puesto_desc',        header: 'Puesto', 			cell: (accionR: any) => `${accionR.puesto_desc}`},
		{ columnDef: 'autoriza_desc',  	   header: 'Situación', 		cell: (accionR: any) => `${accionR.autoriza_desc}`},
		{ columnDef: 'estatus_desc', 	   header: 'Estatus',			cell: (accionR: any) => `${accionR.estatus_desc}`}
	];

	constructor(private activatedRoute: ActivatedRoute,
				public _derechos: DerechosService,
				private _riesgo: RiesgoService,
				private _acceso: AccesoService,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.riesgoID = Number(params['id']);
			this.accion = params['acc'];
			this.ruta_addM = ['/riesgos', 'medicion_riesgo_form', 'I', this.riesgoID];
			this.ruta_addA = ['/riesgos', 'accion_riesgo_form', 'I', this.riesgoID];
		});
		if (this.riesgoID !== 0) {
			this.cargarRiesgo(this.riesgoID);
		}
	}

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.cargarMediciones(this.riesgoID);
		this.cargarAcciones(this.riesgoID);
		this.cargando = false;
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	getDerechos() {
		if (this.accion !== 'V') {
			this._derechos.getDerechosGlobalMenuPromesa(this._MENU).then((data: any) => {
				this.derechos = data;
				this.derechosM = data;
				this.derechosM.consultar = false;
				this.derechosA = data;
				this.derechosM.editar = false;
			}).catch(error => {
				console.log(error);
			});
		}
	}

	cargarRiesgo(riesgoID: number) {
		this.subscription = this._riesgo.getRiesgoById(riesgoID, '0')
			.subscribe(
				(data: any) => {
					this.registro = data.riesgo;
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

	cargarMediciones(riesgoID: number) {
		this.subscription = this._riesgo.getMedicionesByRiesgoId(riesgoID, this._MENU)
			.subscribe(
				(data: any) => {
					this.listadoMediciones = data.mediciones;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	cargarAcciones(riesgoID: number) {
		this.subscription = this._riesgo.getAccionesByRiesgoId(riesgoID, this._MENU)
			.subscribe(
				(data: any) => {
					this.listadoAcciones = data.acciones;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	detectarAccionM(datosM: any): void {
		if (datosM.accion === 'C') {
			this.cancelaMedicion(datosM.row);
		} else if (datosM.accion === 'V') {
			this.openDialog(datosM.row);
		}
	}

	detectarAccionA(datosA: any): void {
		if (datosA.accion === 'C') {
			this.cancelaAccion(datosA.row);
		} else if (datosA.accion === 'V') {
			this.openDialog(datosA.row);
		}
	}

	async cancelaMedicion(registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: 'Está seguro que desea cancelar la medición del riesgo con fecha del ' + registro.fecha_evalua_t + '?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el motivo de cancelación de la medición del riesgo',
				input: 'textarea',
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el motivo de cancelación';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._riesgo.cancelarMedicionRiesgo(registro.riesgo, registro.regid, motivo.toUpperCase())
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

	async cancelaAccion(registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: 'Está seguro que desea cancelar la acción del riesgo "' + registro.accion_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el motivo de cancelación de la acción del riesgo',
				input: 'textarea',
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el motivo de cancelación';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._riesgo.cancelarAccionRiesgo(registro.riesgo, registro.accion_id, motivo.toUpperCase())
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

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: 'Información de la medición ',
				// subtitle: datos.nivel_desc,
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
