import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AccesoService, FodaService, DerechosService } from '../../../services/services.index';
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
	proceso_desc: string;
	derechos: Derechos = {};

	cargando = false;
	jsonData: any;
	listado: any[] = [];

	forma: FormGroup;

	constructor(private activatesRoute: ActivatedRoute,
				private _derechosService: DerechosService,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.subscription = this.activatesRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
			this.titulo = this.proceso_desc;
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.derechos = this._derechosService.getDerechosMenuProceso('foda', this.proceso);
		this.subscription = this._fodaService.getFODAByProceso(this.proceso)
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.foda;
					this._accesoService.guardarStorage(this.jsonData.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
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

}