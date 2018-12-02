import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, OportunidadesService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-autoriza-oportunidades',
	templateUrl: './autoriza-oportunidades.component.html'
})

export class AutorizaOportunidadesComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando = true;
	listado: any[] = [];
	accion: string;
	titulo: string;
	columns = [];
	select = true;
	allowMultiSelect = true;
	seleccionados: any[];
	derechos: Derechos = {administrar: true, cancelar: true, editar: true, insertar: false};
	cancelar: any[] = ['/contexto', 'submenufichaproc', 'oportunidades'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _oportunidades: OportunidadesService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];

			if (this.accion === 'A') {
				this.titulo = 'Pendientes';
				this.derechos.editar = false; // Deshabilita la edicion en la autorizacion
				this.columns = [
					{ columnDef: 'proceso', 		 header: 'ID Proceso',		   align: 'center', cell: (riesgo: any) => `${riesgo.proceso}`},
					{ columnDef: 'proceso_desc', 	 header: 'Proceso',			   cell: (riesgo: any) => `${riesgo.proceso_desc}`},
					{ columnDef: 'riesgo',     	 	 header: 'ID riesgo',   	   align: 'center', cell: (riesgo: any) => `${riesgo.riesgo}`},
					{ columnDef: 'riesgo_desc',	 	 header: 'riesgo',    	   	   cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
					{ columnDef: 'tipo_riesgo_desc', header: 'Tipo de Riesgo',     cell: (riesgo: any) => `${riesgo.tipo_riesgo_desc}`},
					{ columnDef: 'lista_foda', 		 header: 'Cuestiones Externas e Internas',  cell: (riesgo: any) => `${riesgo.lista_foda}`},
					{ columnDef: 'autoriza_desc',    header: 'Situación',		   cell: (riesgo: any) => `${riesgo.autoriza_desc}`},
					{ columnDef: 'motivo_modif',	 header: 'Motivo del cambio',  visible: false, cell: (riesgo: any) => `${riesgo.motivo_modif}`},
					{ columnDef: 'motivo_cancela',	 header: 'Motivo Cancelación', cell: (riesgo: any) => `${riesgo.motivo_cancela}`},
					{ columnDef: 'u_cancela',		 header: 'Usuario Cancela',	   visible: false, cell: (riesgo: any) => `${riesgo.u_cancela}`},
					{ columnDef: 'f_cancela',		 header: 'Fecha Cancela',	   visible: false, cell: (riesgo: any) => `${riesgo.f_cancela}`}
				];
			} else {
				this.titulo = 'Rechazados';
				this.columns = [
					{ columnDef: 'proceso', 		 header: 'ID Proceso',		   align: 'center', cell: (riesgo: any) => `${riesgo.proceso}`},
					{ columnDef: 'proceso_desc', 	 header: 'Proceso',			   cell: (riesgo: any) => `${riesgo.proceso_desc}`},
					{ columnDef: 'riesgo',     	 	 header: 'ID riesgo',   	   	   align: 'center', cell: (riesgo: any) => `${riesgo.riesgo}`},
					{ columnDef: 'riesgo_desc',	 	 header: 'riesgo',    	   	   cell: (riesgo: any) => `${riesgo.riesgo_desc}`},
					{ columnDef: 'tipo_riesgo_desc', header: 'Tipo de Riesgo',     cell: (riesgo: any) => `${riesgo.tipo_riesgo_desc}`},
					{ columnDef: 'lista_foda', 		 header: 'Cuestiones Externas e Internas',  cell: (riesgo: any) => `${riesgo.lista_foda}`},
					{ columnDef: 'autoriza_desc',    header: 'Situación',		   cell: (riesgo: any) => `${riesgo.autoriza_desc}`},
					{ columnDef: 'motivo_rechaza',	 header: 'Motivo Rechazo',	   cell: (riesgo: any) => `${riesgo.motivo_rechaza}`},
					{ columnDef: 'motivo_modif',	 header: 'Motivo del cambio',  visible: false, cell: (riesgo: any) => `${riesgo.motivo_modif}`},
					{ columnDef: 'u_cancela',		 header: 'Usuario Cancela',	   visible: false, cell: (riesgo: any) => `${riesgo.u_cancela}`},
					{ columnDef: 'f_cancela',		 header: 'Fecha Cancela',	   visible: false, cell: (riesgo: any) => `${riesgo.f_cancela}`},
					{ columnDef: 'motivo_cancela',	 header: 'Motivo Cancelación', visible: false, cell: (riesgo: any) => `${riesgo.motivo_cancela}`},
					{ columnDef: 'u_rechaza',		 header: 'Usuario Rechaza',	   visible: false, cell: (riesgo: any) => `${riesgo.u_rechaza}`},
					{ columnDef: 'f_rechaza',		 header: 'Fecha Rechazo',	   visible: false, cell: (riesgo: any) => `${riesgo.f_rechaza}`}
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
		this.subscription.unsubscribe();
	}

	getPendientes() {
		this.subscription = this._oportunidades.getOportunidadesPendientes()
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
		this.subscription = this._oportunidades.getOportunidadesRechazadas()
			.subscribe(
				(data: any) => {
					this.listado = data.rechazadas;
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

}
