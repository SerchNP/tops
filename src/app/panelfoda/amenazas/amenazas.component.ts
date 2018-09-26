import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { SidebarService } from '../../services/services.index';
import { AccesoService } from '../../services/shared/acceso.service';
import swal from 'sweetalert2';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import { FodaService } from '../../services/panelfoda/foda.service';

@Component({
	selector: 'app-amenazas',
	templateUrl: './amenazas.component.html',
	styles: []
})
export class AmenazasComponent implements OnInit {

	@ViewChild('amenazas') dataTable: DataTableComponent;

	tipoUser: string;
	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'clave';
	derechos: Derechosmenu = {};

	length = 0;
	columns: Array<any> = [
		{title: 'ID Proceso', name: 'proceso', columnName: 'proceso',
			filtering: {filterString: '', placeholder: 'Proceso ID'}},
		{title: 'Proceso', name: 'proceso_desc', columnName: 'proceso_desc',
			filtering: {filterString: '', placeholder: 'Proceso'}},
		{title: 'Clave', name: 'foda', columnName: 'foda',
			filtering: {filterString: '', placeholder: 'Clave'}},
		{title: 'No.', name: 'orden', columnName: 'orden', sort: 'asc'},
		{title: 'Amenaza', name: 'foda_desc', columnName: 'foda_desc',
			filtering: {filterString: '', placeholder: 'Amenaza'}},
		{title: 'Estatus', name: 'autoriza_desc', columnName: 'autoriza_desc',
			filtering: {filterString: '', placeholder: 'Estatus'}}
	];

	constructor(private _sidebarService: SidebarService,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {}

	ngOnInit() {
		this.cargando = true;
		this.derechos = this._sidebarService.getDerechos('amenazas');

		this.dataTable.derechos = this.derechos;

		this._fodaService.getFODA('A')
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.foda;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.derechos = this.derechos;
					this.dataTable.columns = this.columns;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.ruta_add = ['/panelfoda', 'amenazas_form', 'I', 0, 'A'];
					this.dataTable.onChangeTable(this.dataTable.config);

					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

}
