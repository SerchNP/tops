import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { AccesoService, ArchivosService, ProcesosService, CatalogosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-archivo-genera',
	templateUrl: './archivo-genera.component.html'
})

export class ArchivoGeneraComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	@ViewChild('periodo') cmb_periodo: ElementRef;

	@BlockUI() blockUI: NgBlockUI;

	cargando = false;
	procesos: any[] = [];
	periodos: any[] = [];
	periodo: string;

	derechos: Derechos = {consultar: false, administrar: false, insertar: false, editar: false, cancelar: false};
	select = true;
	allowMultiSelect = true;
	seleccionados: any[];

	columns = [
		{ columnDef: 'proceso',			header: 'ID Proceso',	cell: (proceso: any) => `${proceso.proceso}`},
		{ columnDef: 'proceso_desc',	header: 'Proceso',		cell: (proceso: any) => `${proceso.proceso_desc}`}
	];

	constructor(private _acceso: AccesoService,
				private _archivo: ArchivosService,
				private _proceso: ProcesosService,
				private _catalogos: CatalogosService) { }

	ngOnInit() {
		this.getProcesos();
		this.getPeriodos();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	cambio() {
		this.periodo = this.cmb_periodo.nativeElement.value;
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario('archivo_genera')
			.subscribe(
				(data: any) => {
					this.procesos = data.procesos;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getPeriodos() {
		this.subscription = this._catalogos.getCatalogoService('PER')
			.subscribe(
				(data: any) => {
					this.periodos = data.catalogo.filter(item => item.estatus === 'ABIERTO');
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

	detectarRegistros(rows): void {
		this.seleccionados = rows;
	}

	generar() {
		if (this.periodo === '' || this.periodo === undefined) {
			swal('ERROR', 'Debe seleccionar el periodo', 'error');
		} else {
			if (this.seleccionados === undefined || this.seleccionados.length === 0) {
				swal('ERROR', 'Debe seleccionar al menos un proceso', 'error');
			} else {
				this.blockUI.start('Espere un momento por favor...');
				this._archivo.generarArchivos(this.periodo, this.seleccionados)
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
						swal('Atención!!!', data.message, 'success');
						this.blockUI.stop();
						this.ngOnInit();
					},
					error => {
						console.log(error);
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			}
		}
	}

}
