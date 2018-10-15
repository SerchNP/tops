import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/services.index';
import { Sistemas } from '../interfaces/sistemas.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

	cargando = false;
	politica = '';
	listadoSistemas: Sistemas[] = [];

	constructor(private _homeService: HomeService) { }

	ngOnInit() {
		this.cargando = true;
		this.getPoliticaCalidad();
		this.getSistemasCalidad();
		this.cargando = false;
	}

	getPoliticaCalidad() {
		this._homeService.getIdentidad(1, 'P')
			.subscribe(
				data => {
					this.politica = data;
				},
				error => {
					swal('ERROR', 'Error al cargar la Política de Calidad', 'error');
					this.cargando = false;
				});
	}

	getSistemasCalidad() {
		this._homeService.getSistemas()
			.subscribe(
				data => {
					this.listadoSistemas = data;
				},
				error => {
					swal('ERROR', 'Error al cargar los Sistemas de Calidad', 'error');
					this.cargando = false;
				});
	}

}
