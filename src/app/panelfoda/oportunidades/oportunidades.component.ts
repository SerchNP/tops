import { Component, OnInit, ViewChild } from '@angular/core';
import { AccesoService, FodaService, SidebarService } from '../../services/services.index';
import swal from 'sweetalert2';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';

@Component({
	selector: 'app-oportunidades',
	templateUrl: './oportunidades.component.html',
	styles: []
})
export class OportunidadesComponent implements OnInit {

	@ViewChild('oportunidades') dataTable: DataTableComponent;

	tipoUser: string;
	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'clave';
	derechos: Derechosmenu = {};
	cuestion: string;

	columns: Array<any> = [
		{title: 'ID Proceso', name: 'proceso', columnName: 'proceso',
			filtering: {filterString: '', placeholder: 'Proceso ID'}},
		{title: 'Proceso', name: 'proceso_desc', columnName: 'proceso_desc',
			filtering: {filterString: '', placeholder: 'Proceso'}},
		{title: 'Clave', name: 'foda', columnName: 'foda',
			filtering: {filterString: '', placeholder: 'Clave'}},
		{title: 'No.', name: 'orden', columnName: 'orden', sort: 'asc'},
		{title: 'Oportunidad', name: 'foda_desc', columnName: 'foda_desc',
			filtering: {filterString: '', placeholder: 'Oportunidad'}},
		{title: 'Estatus', name: 'autoriza_desc', columnName: 'autoriza_desc',
			filtering: {filterString: '', placeholder: 'Estatus'}}
	];

	constructor(private _sidebarService: SidebarService,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.cuestion = 'O';
	}

	ngOnInit() {
		this.cargando = true;
		this.derechos = this._sidebarService.getDerechos('oportunidades');
		// Para la inicializacion del dataTable
		this.dataTable.derechos = this.derechos;

		this._fodaService.getFODA(this.cuestion)
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.foda;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.columns = this.columns;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.data = this.listado;
					this.dataTable.length = this.listado.length;
					this.dataTable.ruta_add = ['/panelfoda', 'oportunidades_form', 'I', 0, this.cuestion];
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
