import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccesoService, FodaService, SidebarService, CatalogosService } from '../../services/services.index';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-foda-formulario',
	templateUrl: './foda-formulario.component.html'
})
export class FodaFormularioComponent implements OnInit {

	private sub: any;
	fodaID: number;
	titulo: string;
	proceso: number;
	proceso_desc: string;
	derechos: Derechosmenu = {};
	cat_autoriza: any[] = [];

	cargando = false;
	jsonData: any;
	listado: any[] = [];

	forma: FormGroup;

	constructor(private activatesRoute: ActivatedRoute,
				private router: Router,
				private _sidebarService: SidebarService,
				private _accesoService: AccesoService,
				private _fodaService: FodaService,
				private _catalogos: CatalogosService) {
		this.sub = this.activatesRoute.params.subscribe(params => {
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
			this.titulo = this.proceso_desc;
		});
	}

	getDescAutoriza: any = (autoriza: number) => {
		const arr = this.cat_autoriza.filter(
			value => value.autoriza === autoriza);
		return arr[0].autoriza_desc;
	}

	ngOnInit() {
		this.cargando = true;
		this.derechos = this._sidebarService.getDerechos('foda');
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

		this._catalogos.getCatalogoAutoriza()
				.subscribe(
					data => {
						this.jsonData = data;
						this.cat_autoriza = this.jsonData.cat_autoriza;
					},
					error => {
						console.log(error);
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._accesoService.logout();
						}
					});
	}

	getDescAutorizaFunc (autoriza: number): string {
		const arr = this.cat_autoriza.filter(
			value => value.autoriza === autoriza);
		return arr[0].autoriza_desc;
	}

}
