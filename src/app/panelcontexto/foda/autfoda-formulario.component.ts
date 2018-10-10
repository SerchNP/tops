import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, FodaService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

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
	derechos: Derechos = {autorizar: true, cancelar: true};
	select = true;
	allowMultiSelect = true;

	seleccionados: any[];

	columns = [
		{ columnDef: 'cuestion_desc', 	header: 'Cuestión',				cell: (foda: any) => `${foda.cuestion_desc}`},
		{ columnDef: 'foda',     		header: 'ID',   				cell: (foda: any) => `${foda.foda}`},
		{ columnDef: 'orden',   		header: 'No.', 					cell: (foda: any) => `${foda.orden}`},
		{ columnDef: 'foda_desc',   	header: 'Descripción', 			cell: (foda: any) => `${foda.foda_desc}`},
		{ columnDef: 'autoriza_desc',   header: 'Situación',			cell: (foda: any) => `${foda.autoriza_desc}`},
		{ columnDef: 'motivo_cancela',	header: 'Motivo Cancelación',	cell: (foda: any) => `${foda.motivo_cancela}`}
	];

	constructor(private activatedRoute: ActivatedRoute, private router: Router,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
		});
	}

	ngOnInit() {
		console.log('entro al init');
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

	detectarRegistros(rows): void {
		this.seleccionados = rows;
	}

	guardar() {
		if (this.seleccionados === undefined || this.seleccionados.length === 0) {
			swal('Atención', 'Debe seleccionar al menos un registro para autorizar', 'error');
		} else {
			console.log(this.seleccionados);
			const arreglo: any[] = [];
			this.seleccionados.forEach(element => {
				arreglo.push(JSON.parse('{"proceso" : ' + element['proceso'] + ', "foda" : ' + element['foda'] + '}'));
			});
			this.subscription = this._fodaService.autorizarFODA(arreglo)
				.subscribe((data: any) => {
					console.log(data);
					swal('Atención!!!', data.message, 'success');
					this.ngOnInit();
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		}
	}
}
