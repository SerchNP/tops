import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService } from '../../services/shared/acceso.service';
import { Derechos } from '../../interfaces/derechos.interface';
import { ProcesosService } from '../../services/services.index';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogDetalleComponent } from '../../components/dialog-detalle/dialog-detalle.component';

@Component ({
	selector: 'app-area-proceso',
	templateUrl: './area-proceso.component.html'
})
export class AreaProcesoComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'clave';
	derechos: Derechos = {insertar: true, editar: false, cancelar: true, consultar: true}; // No tiene opcion de editar
	ruta_add =  ['/paneladm', 'submenuproc', 'area_proceso_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 			header: 'Clave',		cell: (area_proceso: any) => `${area_proceso.clave}`, 	align: 'center'},
		{ columnDef: 'proceso',     	header: 'ID Proceso',	cell: (area_proceso: any) => `${area_proceso.proceso}`,	align: 'center'},
		{ columnDef: 'proceso_desc',   	header: 'Proceso', 		cell: (area_proceso: any) => `${area_proceso.proceso_desc}`},
		{ columnDef: 'area',			header: 'ID Área', 		cell: (area_proceso: any) => `${area_proceso.area}`,	align: 'center'},
		{ columnDef: 'area_desc',   	header: 'Área',			cell: (area_proceso: any) => `${area_proceso.area_desc}`},
		{ columnDef: 'tipo_area_desc',  header: 'Tipo Área',	cell: (area_proceso: any) => `${area_proceso.tipo_area_desc}`},
		{ columnDef: 'activa_desc',		header: 'Situación',	cell: (area_proceso: any) => `${area_proceso.activa_desc}`}
	];

	constructor(private _accesoService: AccesoService,
				private _procesosService: ProcesosService,
				public dialog: MatDialog) {
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._procesosService.getAreasAsignadas(0)
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.areas_asignadas;
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

	async cancelaAreaAsignada(areaPproceso: any) {
		if (areaPproceso.activa === 'N') {
			swal('ERROR', 'La asignación ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el area ' + areaPproceso.area_desc + ' para el proceso ' + areaPproceso.proceso_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de cancelación',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this._procesosService.cancelaAreaAsignada(areaPproceso.clave, motivo.toUpperCase())
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
		}
	}

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: datos.area_desc,
				estatus: datos.activa_desc,
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.cancelaAreaAsignada(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

}
