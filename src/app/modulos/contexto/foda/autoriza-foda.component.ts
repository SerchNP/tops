import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService, FodaService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-autoriza-foda',
	templateUrl: './autoriza-foda.component.html'
})
export class AutorizaFodaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	proceso: number;
	proceso_desc: string;

	cargando = true;
	listado: any[] = [];
	derechos: Derechos = {autorizar: true, administrar: true, cancelar: true, editar: false, insertar: false};
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

	constructor(private activatedRoute: ActivatedRoute,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._fodaService.getFODAByProcesoPndtes(this.proceso)
			.subscribe(
				(data: any) => {
					this.listado = data.foda;
					this._accesoService.guardarStorage(data.token);
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
			swal('Atención!!!', 'Debe seleccionar al menos un registro para autorizar.', 'error');
		} else {
			const arreglo: any[] = [];
			this.seleccionados.forEach(element => {
				arreglo.push(JSON.parse('{"proceso" : ' + element['proceso'] + ', "foda" : ' + element['foda'] + '}'));
			});
			this.subscription = this._fodaService.autorizarFODA(arreglo)
				.subscribe((data: any) => {
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.rechazarFODA(datos.row);
		}
	}

	async rechazarFODA(registro: any) {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: 'Está seguro que desea rechazar el elemento (' + registro.cuestion_desc + ') "' + registro.foda_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el motivo de rechazo del elemento',
				input: 'textarea',
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el motivo de rechazo';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._fodaService.rechazarFODA(registro.proceso, registro.foda, motivo)
					.subscribe((data: any) => {
						this._accesoService.guardarStorage(data.token);
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

}
