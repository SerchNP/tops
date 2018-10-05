import { Component, OnInit, OnDestroy } from '@angular/core';
import { PuestosService, AccesoService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-puestos',
	templateUrl: './puestos.component.html',
	styles: []
})

export class PuestosComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'puesto';
	derechos: Derechos = {insertar: true, editar: true, cancelar: true};

	ruta_add =  ['/paneladm', 'puestos_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'puesto', 			header: 'Puesto',		 cell: (puesto: any) => `${puesto.puesto}`},
		{ columnDef: 'puesto_desc',   	header: 'Descripción', 	 cell: (puesto: any) => `${puesto.puesto_desc}`},
		{ columnDef: 'predecesor', 		header: 'ID Predecesor', cell: (puesto: any) => `${puesto.predecesor}`},
		{ columnDef: 'predecesor_desc', header: 'Predecesor', 	 cell: (puesto: any) => `${puesto.predecesor_desc}`},
		{ columnDef: 'estatus_desc',	header: 'Situación',	 cell: (puesto: any) => `${puesto.estatus_desc}`}
	];

	constructor(public _accesoService: AccesoService,
				public _puestosService: PuestosService,
				private router: Router) {
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._puestosService.getPuestos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.puestos;
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarPuesto(datos.row);
		} else if (datos.accion === 'C') {
			this.borrarPuesto(datos.row);
		}
	}

	editarPuesto(puesto: any) {
		if (puesto.estatus === 'N') {
			swal('ERROR', 'El puesto no se puede modificar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'puestos_form', 'U', puesto.puesto]);
		}
	}

	async borrarPuesto(puesto: any) {
		if (puesto.estatus === 'N') {
			swal('ERROR', 'El puesto ya se encuentra cancelado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el puesto ' + puesto.puesto_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación del puesto',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._puestosService.cancelarPuesto(puesto.puesto, motivo.toUpperCase())
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

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

}
