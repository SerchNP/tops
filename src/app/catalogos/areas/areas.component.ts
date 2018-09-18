import { Component, OnInit } from '@angular/core';
import { AreasService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
	selector: 'app-areas',
	templateUrl: './areas.component.html',
	styles: []
})
export class AreasComponent implements OnInit {

	jsonData: any;
	listadoAreas: any[] = [];
	cargando = false;

	constructor(public _areasService: AreasService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this._areasService.getAreas()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listadoAreas = this.jsonData.areas;
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
