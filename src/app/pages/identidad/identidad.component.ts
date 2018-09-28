import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdentidadService, AccesoService } from '../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-identidad',
	templateUrl: './identidad.component.html'
})

export class IdentidadComponent implements OnInit, OnDestroy {

	private sub: any;
	cargando = false;
	listaIdentidad: any[] = [];
	path = '';
	tipo = 'P';

	constructor(private activatedRoute: ActivatedRoute, private _identidadService: IdentidadService, private _accesoService: AccesoService) {
		this.sub = this.activatedRoute.url.subscribe(url => {
			this.path = url[1].path;
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	getTipo(path: string) {
		let valor = '';
		switch (path) {
			case 'politica' : valor = 'P'; break;
			case 'alcance' : valor = 'A'; break;
			case 'mision' : valor = 'M'; break;
			case 'vision' : valor = 'V'; break;
			case 'notas' : valor = 'N'; break;
			case 'objetivos': valor = 'O'; break;
		}
		return valor;
	}

	ngOnInit() {
		this.cargando = true;
		this.tipo = this.getTipo(this.path);
		this._identidadService.getIdentidad('I', 0, this.tipo)
			.subscribe(
				(data: any) => {
					this.listaIdentidad = data.identidad;
					this._accesoService.guardarStorage(data.token);
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
