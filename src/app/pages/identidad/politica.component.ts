import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentidadService, AccesoService } from '../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-politica',
	templateUrl: './politica.component.html'
})

export class PoliticaComponent implements OnInit {

	cargando = false;
	listaIdentidad: any[] = [];

	constructor(private router: Router, private _identidadService: IdentidadService, private _accesoService: AccesoService) {
	}

	ngOnInit() {
		this.cargando = true;
		this._identidadService.getIdentidad(0, 'P')
			.subscribe(
				data => {
					/*this.jsonData = data;
					this.listadoProcesos = this.jsonData.procesos;
				this._accesoService.guardarStorage(this.jsonData.token);*/
					console.log(data);
					this.listaIdentidad = data;
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
