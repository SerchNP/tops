import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AccesoService } from '../../services/shared/acceso.service';
import { Derechos } from '../../interfaces/derechos.interface';
import { ProcesosService } from '../../services/services.index';
import { SelectionModel } from '@angular/cdk/collections';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

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
	derechos: Derechos = {insertar: true, editar: false, cancelar: true}; // No tiene opcion de editar
	ruta_add =  ['/paneladm', 'submenuproc', 'area_proceso_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'clave', 			header: 'Clave',		cell: (area_proceso: any) => `${area_proceso.clave}`},
		{ columnDef: 'proceso',     	header: 'ID Proceso',	cell: (area_proceso: any) => `${area_proceso.proceso}`},
		{ columnDef: 'proceso_desc',   	header: 'Proceso', 		cell: (area_proceso: any) => `${area_proceso.proceso_desc}`},
		{ columnDef: 'area',			header: 'ID Área', 		cell: (area_proceso: any) => `${area_proceso.area}`},
		{ columnDef: 'area_desc',   	header: 'Área',			cell: (area_proceso: any) => `${area_proceso.area_desc}`},
		{ columnDef: 'tipo_area_desc',  header: 'Tipo Área',	cell: (area_proceso: any) => `${area_proceso.tipo_area_desc}`},
		{ columnDef: 'activa_desc',		header: 'Situación',	cell: (area_proceso: any) => `${area_proceso.activa_desc}`}
	];

	selection = new SelectionModel<{}>(true, []);

	constructor(private _accesoService: AccesoService,
				private _procesosService: ProcesosService) {
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'C') {
			this.cancelaAreaAsignada(datos.row);
		}
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

}
