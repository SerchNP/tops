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
		{ columnDef: 'riesgo', 		 	    header: 'ID Riesgo', 		  align: 'center', cell: (riesgo: any) => `${riesgo.riesgo}`},
		{ columnDef: 'riesgo_desc',	 	    header: 'Riesgo',    		  cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
		{ columnDef: 'estado_desc',     	header: 'Estado',  			  cell: (riesgo: any) => `${riesgo.predecesor_desc}`},
		{ columnDef: 'ocurre_desc',     	header: 'Probabilidad o Frecuencia', cell: (riesgo: any) => `${riesgo.ocurre_desc}`},
		{ columnDef: 'valorc_o',     		header: 'Valor Cuantitativo', cell: (riesgo: any) => `${riesgo.valorc_o}`},
		{ columnDef: 'impacto_desc',     	header: 'Impacto', 			  cell: (riesgo: any) => `${riesgo.impacto_desc}`},
		{ columnDef: 'valorc_i',     		header: 'Valor Cuantitativo', cell: (riesgo: any) => `${riesgo.valorc_i}`},
		{ columnDef: 'valor_total',     	header: 'Valor Cuantitativo Ponderado Total', cell: (riesgo: any) => `${riesgo.valor_total}`},
		{ columnDef: 'nivel_desc',     		header: 'Nivel de Riesgo',    color: true, cell: (riesgo: any) => `${riesgo.nivel_desc}`},
		{ columnDef: 'lista_causas', 	    header: 'Causas',  			  visible: false, cell: (riesgo: any) => `${riesgo.lista_causas}`},
		{ columnDef: 'lista_consecuencias', header: 'Consecuencias',  	  visible: false,  cell: (riesgo: any) => `${riesgo.lista_consecuencias}`},
		{ columnDef: 'responsable', 	 	header: 'Responsable',  	  visible: false, cell: (riesgo: any) => `${riesgo.responsable}`},
		{ columnDef: 'puesto_desc', 	 	header: 'Puesto',  			  visible: false, cell: (riesgo: any) => `${riesgo.puesto_desc}`}
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
			this.derechos.insertar = true;
			this.derechos.cancelar = true;
			this._derechos.PRIVILEGIOS = data;
			localStorage.setItem('actionsMR', JSON.stringify(this.derechos));
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
