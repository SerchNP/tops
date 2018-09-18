import { Component, OnInit } from '@angular/core';
import { PrincipalService } from '../services/services.index';
import { Sistemas } from '../interfaces/sistemas.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

	cargando = false;
	listadoSistemas: Sistemas[] = [];

	constructor(private _principalService: PrincipalService) { }

	ngOnInit() {
		this.cargando = true;
		this._principalService.getSistemas()
			.subscribe(
				data => {
					console.log(data);
					this.listadoSistemas = data;
					this.cargando = false;
				},
				error => {
					console.error(error);
					swal('ERROR', 'Error al cargar la página principal', 'error');
					this.cargando = false;
				});
	}

}
