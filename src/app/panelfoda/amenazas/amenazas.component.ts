import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { SidebarService } from '../../services/services.index';
import { AccesoService } from '../../services/shared/acceso.service';
import swal from 'sweetalert2';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';

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

	length = 0;
	columns: Array<any> = [
		{title: 'Clave', name: 'clave', columnName: 'clave',
			filtering: {filterString: '', placeholder: 'Clave'}},
		{title: 'Proceso', name: 'proceso_desc', columnName: 'proceso_desc',
			filtering: {filterString: '', placeholder: 'Proceso'}},
		{title: 'No.', name: 'numero', columnName: 'numero', sort: 'asc'},
		{title: 'Descripción', name: 'descrip', columnName: 'descrip',
			filtering: {filterString: '', placeholder: 'Descripción'}},
		{title: 'Estatus', name: 'autoriza_desc', columnName: 'autoriza_desc',
			filtering: {filterString: '', placeholder: 'Estatus'}}
	];

	constructor(private _sidebarService: SidebarService, private _accesoService: AccesoService) { }

	ngOnInit() {
		this.cargando = true;
		const derechos: Derechosmenu = this._sidebarService.getDerechos('amenazas');

		if (derechos.administra) {
			this.dataTable.insertar = true;
			this.dataTable.editar = true;
			this.dataTable.cancelar = true;
		}
		this.cargando = false;
	}

}
