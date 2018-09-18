import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrincipalService } from '../services/services.index';

@Component({
	selector: 'app-detalle',
	templateUrl: './detalle.component.html'
})

export class DetalleComponent implements OnInit {

	idSistema: number;
	politica: string;
	mision: string;
	vision: string;
	notas: string;
	alcance: string;
	objetivos: string[];

	constructor(private activatesRoute: ActivatedRoute, private router: Router, private _principalService: PrincipalService) {
		this.activatesRoute.params.subscribe(params => {
			this.idSistema = params['id'];
		});
	}

	ngOnInit() { 
		/*this._principalService.getProcesos()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listadoProcesos = this.jsonData.procesos;
					this._usersService.guardarStorage(this.jsonData.token);
					this.cargando = false;
				},
				error => {
					// console.error(error);
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._usersService.logout();
					}
				});*/
	}

}
