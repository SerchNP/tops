import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { IdentidadService, AccesoService } from '../../services/services.index';

@Component({
	selector: 'app-objetivos-calidad',
	templateUrl: './objetivos-calidad.component.html'
})

export class ObjetivosCalidadComponent implements OnInit {

	@ViewChild('dtObjetivos') dataTable: DataTableComponent;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	// llave = 'area';
	derechos: Derechosmenu = {insertar: true, editar: true, cancelar: true};

	columns: Array<any> = [
		{title: 'Id Sistema', name: 'sistema', columnName: 'sistema',
			filtering: {filterString: '', placeholder: 'Id S'}},
		{title: 'Sistema', name: 'sistema_desc', columnName: 'sistema_desc',
			filtering: {filterString: '', placeholder: 'Sistema'}},
		{title: 'Número', name: 'numero', columnName: 'numero'},
		{title: 'Descripción', name: 'descrip', columnName: 'descrip',
			filtering: {filterString: '', placeholder: 'Descripción'}},
		{title: 'Situación', name: 'autoriza_desc', columnName: 'autoriza_desc',
			filtering: {filterString: '', placeholder: 'Situación'}},
		{title: 'Estatus', name: 'activo_desc', columnName: 'activo_desc',
			filtering: {filterString: '', placeholder: 'Estatus'}}
	];

	constructor(private router: Router, public _accesoService: AccesoService, public _identidad: IdentidadService, ) { }

	ngOnInit() {
		this.cargando = true;
		// Para la inicializacion del dataTable
		this.dataTable.derechos = this.derechos;

		this._identidad.getIdentidad('C', 0, 'O')
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.identidad;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.columns = this.columns;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.ruta_add = ['/paneladm', 'submenuident', 'objetivos_form', 'I', 0];
					this.dataTable.onChangeTable(this.dataTable.config);
					console.log(this.jsonData);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	detectarAccion(accion: any): void {
		if (accion.column === 'action_e') {
			this.editarObjetivo(accion.row);
		} else if (accion.column === 'action_c') {
			// this.borrarArea(accion.row);
		}
	}

	editarObjetivo(objetivo: any) {
		if (objetivo.activo === 'N') {
			swal('ERROR', 'El objetivo de calidaf no se puede modificar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'submenuident', 'objetivos_form', 'U', objetivo.clave]);
		}
	}

}


/*
	async borrarArea(area: any) {
		if (area.estatus === 'N') {
			swal('ERROR', 'El área ya está previamente cancelado', 'error');
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
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this._areasService.cancelarArea(area.area, motivo.toUpperCase())
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
*/