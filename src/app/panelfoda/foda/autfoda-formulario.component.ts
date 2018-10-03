import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, FodaService } from '../../services/services.index';
import { SelectionModel } from '@angular/cdk/collections';
import { FodaC } from '../../models/fodaC.model';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Derechos } from '../../interfaces/derechos.interface';

@Component({
	selector: 'app-autfoda-formulario',
	templateUrl: './autfoda-formulario.component.html'
})
export class AutfodaFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	proceso: number;
	proceso_desc: string;

	cargando = true;
	jsonData: any;
	listado: any[] = [];
	derechos: Derechos = {autorizar: true};
	select = true;
	allowMultiSelect = true;

	columns = [
		{ columnDef: 'cuestion_desc', 	header: 'Cuestión',				cell: (foda: FodaC) => `${foda.cuestion_desc}`},
		{ columnDef: 'foda',     		header: 'ID',   				cell: (foda: FodaC) => `${foda.foda}`},
		{ columnDef: 'orden',   		header: 'No.', 					cell: (foda: FodaC) => `${foda.orden}`},
		{ columnDef: 'foda_desc',   	header: 'Descripción', 			cell: (foda: FodaC) => `${foda.foda_desc}`},
		{ columnDef: 'autoriza_desc',   header: 'Situación',			cell: (foda: FodaC) => `${foda.autoriza_desc}`},
		{ columnDef: 'motivo_cancela',	header: 'Motivo Cancelación',	cell: (foda: FodaC) => `${foda.motivo_cancela}`}
	];

	selection = new SelectionModel<FodaC>(true, []);

	constructor(private activatesRoute: ActivatedRoute,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.subscription = this.activatesRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._fodaService.getFODAByProcesoP(this.proceso)
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
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}
}
