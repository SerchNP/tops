import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AccesoService, ArchivosService, ProcesosService, CatalogosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-archivo-genera',
	templateUrl: './archivo-genera.component.html'
})

export class ArchivoGeneraComponent implements OnInit, OnDestroy, OnChanges {

	private subscription: Subscription;

	cargando = false;
	procesos: any[] = [];
	periodos: any[] = [];
	tipo: string;

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

	ngOnChanges(changes): void {
		if (changes['tipogen']) {
			console.log(this.tipo);
		}
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario('riesgo_operativo')
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
		// Bloquear pantalla
		if (this.seleccionados === undefined || this.seleccionados.length === 0) {
			swal('ERROR', 'Debe seleccionar al menos un proceso', 'error');
		} else {
			console.log(this.seleccionados);
			// Recuperar periodo seleccionado
			this._archivo.generarArchivos('TM201804', this.seleccionados)
				.subscribe((data: any) => {
					this._acceso.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					// Desbloquear pantalla
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
