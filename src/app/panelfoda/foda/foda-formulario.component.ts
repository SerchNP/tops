import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccesoService, FodaService } from '../../services/services.index';
import { Foda } from '../../interfaces/foda.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-foda-formulario',
	templateUrl: './foda-formulario.component.html',
	styles: []
})
export class FodaFormularioComponent implements OnInit {

	private sub: any;
	accion: string;
	fodaID: number;
	titulo: string;
	select_invalid: string;
	seleccionado = '';
	proceso: number;
	proceso_desc: string;

	cargando = false;
	jsonData: any;
	listadoFODA: any[] = [];

	foda: Foda;

	forma: FormGroup;

	constructor(private activatesRoute: ActivatedRoute,
				private router: Router,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.sub = this.activatesRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.proceso = params['p'];
			this.proceso_desc = params['d'];
		});
		// tslint:disable-next-line:max-line-length
		this.titulo = (this.accion === 'V' ? 'Consulta FODA' : (this.accion === 'I' ? 'Registro FODA' : (this.accion === 'E' ? 'Actualiza FODA' : 'Cancela FODA')));
	}

	ngOnInit() {
		this.cargando = true;
		this._fodaService.getFODAByProceso(this.proceso)
			.subscribe(
				data => {
					this.jsonData = data;
					this.listadoFODA = this.jsonData.foda;
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
