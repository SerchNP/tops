import { Component, OnInit, OnDestroy } from '@angular/core';
import { PuestosService, AccesoService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';


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
	derechos: Derechos = {consultar: true, administrar: true, insertar: true, editar: true, cancelar: true};

	ruta_add =  ['/administracion', 'puestos_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'puesto', 			header: 'Puesto',		 cell: (puesto: any) => `${puesto.puesto}`},
		{ columnDef: 'puesto_desc',   	header: 'Descripción', 	 cell: (puesto: any) => `${puesto.puesto_desc}`},
		{ columnDef: 'predecesor', 		header: 'ID Predecesor', cell: (puesto: any) => `${puesto.predecesor}`},
		{ columnDef: 'predecesor_desc', header: 'Predecesor', 	 cell: (puesto: any) => `${puesto.predecesor_desc}`},
		{ columnDef: 'autoriza_desc',	header: 'Situación',	 cell: (puesto: any) => `${puesto.autoriza_desc}`}
	];

	constructor(public _accesoService: AccesoService,
				public _puestosService: PuestosService,
				private router: Router, public dialog: MatDialog) {
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

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarPuesto(datos.row);
		} else if (datos.accion === 'C') {
			this.borrarPuesto(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	editarPuesto(puesto: any) {
		if (puesto.autoriza === 7) {
			swal('ERROR', 'El puesto no se puede modificar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/administracion', 'puestos_form', 'U', puesto.puesto]);
		}
	}

	async borrarPuesto(puesto: any) {
		if (puesto.autoriza === 7) {
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
					input: 'textarea',
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

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.puesto_desc,
				situacion: datos.autoriza_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica,
				u_cancela: datos.u_cancela,
				f_cancela: datos.f_cancela,
				motivo_cancela: datos.motivo_cancela
			}
		});
	}

}
