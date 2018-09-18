import { Component, OnInit } from '@angular/core';
import { PuestosService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
	selector: 'app-puestos',
	templateUrl: './puestos.component.html',
	styles: []
})

export class PuestosComponent implements OnInit {

	jsonData: any;
	listadoPuestos: any[] = [];
	cargando = false;

	constructor(public _puestosService: PuestosService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this._puestosService.getPuestos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listadoPuestos = this.jsonData.puestos;
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
