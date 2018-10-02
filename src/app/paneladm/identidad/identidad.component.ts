import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import { IdentidadService, AccesoService } from '../../services/services.index';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
	selector: 'app-identidad',
	templateUrl: './identidad.component.html'
})

export class IdentidadComponent implements OnInit, OnDestroy {

	@ViewChild('dtIdentidad') dataTable: DataTableComponent;

	private sub: any;
	path = '';
	tipo = '';

	cargando = false;
	derechos: Derechosmenu = {insertar: true, editar: true, cancelar: true};
	listado: any[] = [];
	columns: Array<any> = [
		{title: 'Id Sistema', name: 'sistema', columnName: 'sistema',
			filtering: {filterString: '', placeholder: 'Id S'}},
		{title: 'Sistema', name: 'sistema_desc', columnName: 'sistema_desc',
			filtering: {filterString: '', placeholder: 'Sistema'}},
		// {title: 'Número', name: 'numero', columnName: 'numero'},
		{title: 'Descripción', name: 'descrip', columnName: 'descrip',
			filtering: {filterString: '', placeholder: 'Descripción'}},
		{title: 'Situación', name: 'autoriza_desc', columnName: 'autoriza_desc',
			filtering: {filterString: '', placeholder: 'Situación'}},
		{title: 'Estatus', name: 'activo_desc', columnName: 'activo_desc',
			filtering: {filterString: '', placeholder: 'Estatus'}}
	];

	constructor(private activatedRoute: ActivatedRoute, private router: Router,
				public _acceso: AccesoService, public _identidad: IdentidadService) {
		this.sub = this.activatedRoute.url.subscribe(url => {
			this.path = url[0].path;
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.tipo = this.getTipo(this.path);
		if (this.tipo === 'O') {
			this.columns.splice(2, 0, {title: 'Número', name: 'numero', columnName: 'numero'});
		}
		// Para la inicializacion del dataTable
		this.dataTable.derechos = this.derechos;
		this._identidad.getIdentidad('C', 0, this.tipo)
			.subscribe(
				(data: any) => {
					this.listado = data.identidad;
					this._acceso.guardarStorage(data.token);

					this.dataTable.columns = this.columns;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.ruta_add = ['/paneladm', 'submenuident', 'identidad_form', this.tipo, 'I', 0];
					this.dataTable.onChangeTable(this.dataTable.config);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	getTipo(path: string) {
		let valor = '';
		switch (path) {
			case 'identidad_p' : valor = 'P'; break;
			case 'identidad_a' : valor = 'A'; break;
			case 'identidad_m' : valor = 'M'; break;
			case 'identidad_v' : valor = 'V'; break;
			case 'identidad_n' : valor = 'N'; break;
			case 'identidad_o' : valor = 'O'; break;
		}
		return valor;
	}

	detectarAccion(accion: any): void {
		if (accion.column === 'action_e') {
			this.editarIdentidad(accion.row);
		} else if (accion.column === 'action_c') {
			// this.borrarArea(accion.row);
		}
	}

	editarIdentidad(identidad: any) {
		if (identidad.activo === 'N') {
			swal('ERROR', 'El registro seleccionado no se puede modificar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'submenuident', 'identidad_form', this.tipo, 'U', identidad.clave]);
		}
	}

}
