import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AccesoService, FodaService, CatalogosService, DerechosService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-foda-formulario',
	templateUrl: './foda-formulario.component.html'
})
export class FodaFormularioComponent implements OnInit {

	private sub: any;
	titulo: string;
	proceso: number;
	proceso_desc: string;
	derechos: Derechos = {};
	cat_autoriza: any[] = [];

	cargando = false;
	jsonData: any;
	listado: any[] = [];

	forma: FormGroup;

	constructor(private activatesRoute: ActivatedRoute,
				private _derechosService: DerechosService,
				private _accesoService: AccesoService,
				private _fodaService: FodaService,
				private _catalogos: CatalogosService) {
		this.sub = this.activatesRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
			this.titulo = this.proceso_desc;
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.derechos = this._derechosService.getDerechosProceso(this.proceso);
		this._fodaService.getFODAByProceso(this.proceso)
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.foda;
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
