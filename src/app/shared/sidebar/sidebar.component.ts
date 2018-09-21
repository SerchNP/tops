import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService, AccesoService } from '../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

	cargando: boolean;
	jsonData: any;
	menus: any = [];

	constructor(public _sidebarService: SidebarService, private _router: Router, public _accesoService: AccesoService) {
	}

	ngOnInit() {
		this.cargando = true;
		this._sidebarService.getMenu()
			.subscribe(
				data => {
					this.jsonData = data;
					this.menus = this.jsonData.menu;
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

}
