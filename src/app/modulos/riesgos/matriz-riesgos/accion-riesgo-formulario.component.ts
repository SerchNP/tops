import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RiesgoService, AccesoService, DerechosService, CatalogosService } from '../../../services/services.index';
import { MatDialog } from '@angular/material';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Riesgo } from '../../../interfaces/riesgo.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-accion-riesgo-formulario',
	templateUrl: './accion-riesgo-formulario.component.html'
})
export class AccionRiesgoFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'matriz_riesgos';

	riesgoID: number;
	registro: Riesgo = {};
	cargando = false;
	titulo: string;
	cancelar: any [];
	derechos: Derechos = {};
	accion: string;

	cat_acciones: any [] = [];
	cat_impacto: any [] = [];

	constructor(private activatedRoute: ActivatedRoute,
				public _derechos: DerechosService,
				private _riesgo: RiesgoService,
				private _acceso: AccesoService,
				private _catalogos: CatalogosService,
				private router: Router,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.riesgoID = Number(params['id']);
			this.accion = params['acc'];
			this.cancelar = ['/riesgos', 'trata_riesgo_form', 'U', this.riesgoID];
		});
		this.titulo = 'Registro de Acciones';
		if (this.riesgoID !== 0) {
			this.cargarRiesgo(this.riesgoID);
		}
	}

	ngOnInit() {
		this.cargando = true;
		this.cargando = false;
		this.getCatalogos();
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	getCatalogos () {
		/*this._catalogos.getTipoAccion(20).then((data: any) => {
			this.cat_acciones = data;
		}).catch(error => {
			console.log(error);
		});

		this._catalogos.getImpactoRiesgo().then((data: any) => {
			this.cat_impacto = data;
		}).catch(error => {
			console.log(error);
		});*/
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
