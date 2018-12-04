import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AccesoService, FodaService, DerechosService, ProcesosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-foda-formulario',
	templateUrl: './foda-formulario.component.html'
})
export class FodaFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	titulo: string;
	proceso: number;
	derechos: Derechos = {};
	registro: any = {};
	cargando = false;
	listado: any[] = [];

	forma: FormGroup;

	constructor(private activatesRoute: ActivatedRoute,
				private _derechos: DerechosService,
				private _acceso: AccesoService,
				private _proceso: ProcesosService,
				private _foda: FodaService) {
		this.subscription = this.activatesRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.getProceso(this.proceso);
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.derechos = this._derechos.getDerechosMenuProceso('foda', this.proceso);
		this.subscription = this._foda.getFODAByProceso(this.proceso)
			.subscribe(
				(data: any) => {
					this.listado = data.foda;
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
		try {
			this.subscription.unsubscribe();
		} catch (Exception) {
			console.log(Exception);
		}
	}

	getProceso (proceso: number) {
		this.subscription = this._proceso.getProcesoById(proceso)
			.subscribe(
				(data: any) => {
					this.registro = data.proceso;
					this.titulo = this.registro.proceso_desc;
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
