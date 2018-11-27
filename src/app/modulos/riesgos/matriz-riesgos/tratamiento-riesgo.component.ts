import { Component, OnInit, OnDestroy } from '@angular/core';
import { RiesgoService, AccesoService, DerechosService } from '../../../services/services.index';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Riesgo } from '../../../interfaces/riesgo.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-tratamiento-riesgo',
	templateUrl: './tratamiento-riesgo.component.html'
})
export class TratamientoRiesgoComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	riesgoID: number;
	registro: Riesgo = {};
	listado: any[] = [];
	cargando = false;
	titulo: string;
	insertar: boolean;
	cancelar = ['/riesgos', 'matriz_riesgos'];
	select = false;
	allowMultiSelect = false;
	derechos: Derechos = {};
	accion: string;

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
				private _riesgo: RiesgoService,
				private _acceso: AccesoService,
				private router: Router,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.riesgoID = Number(params['id']);
			this.accion = params['acc'];
		});
		if (this.riesgoID !== 0) {
			this.cargarRiesgo(this.riesgoID);
		}
	}

	ngOnInit() {
		this.cargando = true;
		this.derechos = JSON.parse(localStorage.getItem('actionsMR'));
		this.insertar = this.derechos.insertar;
		this.derechos.consultar = false;
		this.derechos.insertar = this.derechos.administrar;
		this.derechos.editar = false;
		this.derechos.cancelar = this.derechos.administrar;
		// this.subscription = this._riesgo.getMedicionesIndicador(this.riesgoID)
		// 	.subscribe(
		// 		(data: any) => {
		// 			this.listado = data.mediciones;
		// 			this._acceso.guardarStorage(data.token);
		// 			this.cargando = false;
		// 		},
		// 		error => {
		// 			swal('ERROR', error.error.message, 'error');
		// 			if (error.error.code === 401) {
		// 				this._acceso.logout();
		// 			}
		// 		});
	}

	ngOnDestroy() {
		localStorage.removeItem('actionsMR');
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	cargarRiesgo(riesgoID: number) {
		this.subscription = this._riesgo.getRiesgoById(riesgoID, 'O')
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
}
