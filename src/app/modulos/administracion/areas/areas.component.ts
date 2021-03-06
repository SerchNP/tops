import { Component, OnInit, OnDestroy } from '@angular/core';
import { AreasService, AccesoService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { MatDialog } from '@angular/material';


@Component({
	selector: 'app-areas',
	templateUrl: './areas.component.html',
	styles: []
})
export class AreasComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: true, administrar: true, insertar: true, editar: true, cancelar: true};
	ruta_add = ['/administracion', 'areas_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'area', 			header: 'Área',				cell: (area: any) => `${area.area}`, 			align: 'center'},
		{ columnDef: 'area_desc',   	header: 'Descripción',		cell: (area: any) => `${area.area_desc}`},
		{ columnDef: 'predecesor',  	header: 'ID Predecesor',	cell: (area: any) => `${area.predecesor}`,		align: 'center'},
		{ columnDef: 'predecesor_desc',	header: 'Predecesor',		cell: (area: any) => `${area.predecesor_desc}`},
		{ columnDef: 'tipo_desc',		header: 'Tipo',			 	cell: (area: any) => `${area.tipo_desc}`},
		{ columnDef: 'autoriza_desc',	header: 'Situación',		cell: (area: any) => `${area.autoriza_desc}`},
		{ columnDef: 'ent_data',		header: 'Ent. Datos',		cell: (area: any) => `${area.ent_data}`},
		{ columnDef: 'u_cancela',		header: 'Usuario Cancela',	cell: (area: any) => `${area.u_cancela}`, 		visible: false},
		{ columnDef: 'f_cancela',		header: 'Fecha Cancela',	cell: (area: any) => `${area.f_cancela}`, 		visible: false},
		{ columnDef: 'motivo_cancela',	header: 'Motivo Cancela',	cell: (area: any) => `${area.motivo_cancela}`, 	visible: false}
	];

	constructor(public _areasService: AreasService,
				public _accesoService: AccesoService,
				private router: Router, public dialog: MatDialog) {}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._areasService.getAreas()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.areas;
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
			this.editarArea(datos.row);
		} else if (datos.accion === 'C') {
			this.borrarArea(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	editarArea(area: any) {
		if (area.autoriza === 7) {
			swal('ERROR', 'No es posible modificar el área, ya se encuentra cancelada', 'error');
		} else {
			this.router.navigate(['/administracion', 'areas_form', 'U', area.area]);
		}
	}

	async borrarArea(area: any) {
		if (area.autoriza === 7) {
			swal('ERROR', 'El área ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el área ' + area.area_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación del área',
					input: 'textarea',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._areasService.cancelarArea(area.area, motivo.toUpperCase())
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
				title: datos.area_desc,
				situacion: datos.autoriza_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica
			}
		});
	}

}
