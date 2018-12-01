import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService, RiesgoService, DerechosService } from '../../../services/services.index';
import { Opciones } from '../../../interfaces/opciones.interface';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-matriz-riesgos',
	templateUrl: './matriz-riesgos.component.html'
})
export class MatrizRiesgosComponent implements OnInit, OnDestroy {

	private _MENU = 'matriz_riesgos';

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	select = false;
	allowMultiSelect = false;
	opciones: Opciones = { detalle: true };
	derechos: Derechos = {};

	columns = [
		{ columnDef: 'proceso',     	    header: 'ID Proceso',		  align: 'center', cell: (riesgo: any) => `${riesgo.proceso}`},
		{ columnDef: 'proceso_desc',   	    header: 'Proceso', 			  cell: (riesgo: any) => `${riesgo.proceso_desc}`},
		{ columnDef: 'consecutivo', 		header: 'No.', 		  		  align: 'center', cell: (riesgo: any) => `${riesgo.consecutivo}`},
		{ columnDef: 'riesgo_desc',	 	    header: 'Riesgo',    		  cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
		{ columnDef: 'estado_desc',     	header: 'Estado',  			  cell: (riesgo: any) => `${riesgo.estado_desc}`},
		{ columnDef: 'fecha_evalua_t',   	header: 'Fecha Evaluación',   align: 'center', cell: (riesgo: any) => `${riesgo.fecha_evalua_t}`},
		{ columnDef: 'ocurre_desc',     	header: 'PF',				  align: 'center', cell: (riesgo: any) => `${riesgo.ocurre_desc}`},
		{ columnDef: 'valorc_o',     		header: 'Valor CPF', 		  align: 'center', cell: (riesgo: any) => `${riesgo.valorc_o}`},
		{ columnDef: 'impacto_desc',     	header: 'Impacto', 			  align: 'center', cell: (riesgo: any) => `${riesgo.impacto_desc}`},
		{ columnDef: 'valorc_i',     		header: 'Valor CI',  		  align: 'center', cell: (riesgo: any) => `${riesgo.valorc_i}`},
		{ columnDef: 'valorc_total',     	header: 'Valor CPT', 		  align: 'center', cell: (riesgo: any) => `${riesgo.valorc_total}`},
		{ columnDef: 'valor_compara',     	header: 'Valor RR', 		  align: 'center', cell: (riesgo: any) => `${riesgo.valor_compara}`},
		{ columnDef: 'cm_desc',     		header: 'Valor CM', 		  align: 'center', cell: (riesgo: any) => `${riesgo.cm_desc}`},
		// tslint:disable-next-line:max-line-length
		{ columnDef: 'nivel_desc',     		header: 'Nivel',    		  color: true, align: 'center', cell: (riesgo: any) => `${riesgo.nivel_desc}`},
		// tslint:disable-next-line:max-line-length
		{ columnDef: 'situacion_riesgo_desc',	header: 'Situación Riesgo',	visible: false, cell: (riesgo: any) => `${riesgo.situacion_riesgo_desc}`},
		{ columnDef: 'lista_causas', 	    header: 'Causas',  			  visible: false, cell: (riesgo: any) => `${riesgo.lista_causas}`},
		{ columnDef: 'lista_consecuencias', header: 'Consecuencias',  	  visible: false,  cell: (riesgo: any) => `${riesgo.lista_consecuencias}`},
		{ columnDef: 'responsable', 	 	header: 'Responsable',  	  visible: false, cell: (riesgo: any) => `${riesgo.responsable}`},
		{ columnDef: 'puesto_desc', 	 	header: 'Puesto',  			  visible: false, cell: (riesgo: any) => `${riesgo.puesto_desc}`},
		{ columnDef: 'impacto_texto', 	 	header: 'Impacto del Riesgo', visible: false, cell: (riesgo: any) => `${riesgo.impacto_texto}`},
		{ columnDef: 'tipo_accion_desc', 	header: 'Acción',	          visible: false, cell: (riesgo: any) => `${riesgo.tipo_accion_desc}`},
		{ columnDef: 'accion', 			 	header: 'Acción a Tomar', 	  visible: false, cell: (riesgo: any) => `${riesgo.accion}`}
	];

	constructor(private _acceso: AccesoService,
		private _riesgo: RiesgoService,
		public _derechos: DerechosService,
		private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this.getDerechos();
		this.subscription = this._riesgo.getMatrizRiesgos(this._MENU)
			.subscribe(
				(data: any) => {
					this.listado = data.matriz;
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
			this.seguimientoRiesgo(datos.row);
		} else if (datos.accion === 'D') {
			this.detalleRiesgo(datos.row);
		}
	}

	getDerechos() {
		this._derechos.getDerechosGlobalMenuPromesa(this._MENU).then((data: any) => {
			this.derechos = data;
			this.derechos.consultar = false;
			this.derechos.insertar = false;
			this.derechos.cancelar = false;
			// this._derechos.PRIVILEGIOS = data;
			// localStorage.setItem('actionsMR', JSON.stringify(this.derechos));*/
		}).catch(error => {
			console.log(error);
		});
	}

	seguimientoRiesgo(riesgo) {
		if (riesgo.autoriza === 7) {
			swal('ERROR', 'No es posible dar seguimiento al riesgo, ya se encuentra cancelado', 'error');
		} else {
			this.router.navigate(['/riesgos', 'trata_riesgo_form', 'U', riesgo.riesgo]);
		}
	}

	detalleRiesgo(riesgo) {
		this.router.navigate(['/riesgos', 'trata_riesgo_form', 'V', riesgo.riesgo]);
	}

}
