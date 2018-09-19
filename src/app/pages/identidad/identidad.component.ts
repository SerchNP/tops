import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdentidadService, AccesoService } from '../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-identidad',
	templateUrl: './identidad.component.html'
})

export class IdentidadComponent implements OnInit {

	cargando = false;
	listaIdentidad: any[] = [];
	path = '';
	tipo = 'P';

	constructor(private activatedRoute: ActivatedRoute, private _identidadService: IdentidadService, private _accesoService: AccesoService) {
		// console.log(activatedRoute.url.value[1].path);
		this.path = activatedRoute.url.value[1].path;
	}

	getTipo(path: string) {
		switch (path) {
			case 'politica' : return 'P'; break;
			case 'alcance' : return 'A'; break;
			case 'mision' : return 'M'; break;
			case 'vision' : return 'V'; break;
			case 'notas' : return 'N'; break;
			case 'objetivos': return 'O'; break;
		}
	}

	ngOnInit() {
		this.cargando = true;
		this.tipo = this.getTipo(this.path);
		this._identidadService.getIdentidad(0, this.tipo)
			.subscribe(
				data => {
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
