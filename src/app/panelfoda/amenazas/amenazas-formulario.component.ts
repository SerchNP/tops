import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccesoService, FodaService } from '../../services/services.index';
import { Foda } from '../../interfaces/foda.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-amenazas-formulario',
	templateUrl: './amenazas-formulario.component.html',
	styles: []
})
export class AmenazasFormularioComponent implements OnInit {

	private sub: any;
	accion: string;
	idFoda: number;
	titulo: string;
	select_invalid: string;
	seleccionado = '';
	procesos: any [] = [];
	cuestiones: any [] = [];
	cuestion: string;

	foda: Foda;

	forma: FormGroup;

	constructor(private activatesRoute: ActivatedRoute,
				private router: Router,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {
		this.sub = this.activatesRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idFoda = params['id'];
			this.cuestion = params['t'];
		});
		this.titulo = (this.accion === 'I' ? 'Registro de Amenazas' : 'Actualización de Amenazas');

		if (this.idFoda !== 0) {
			// this.cargarProceso(this.idProceso);
		}
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'orden' : new FormControl('', Validators.required),
			'foda' : new FormControl(),
			'foda_desc': new FormControl('', Validators.required),
			'proceso' : new FormControl('', Validators.required),
			'cuestion' : new FormControl(this.cuestion, Validators.required)
		});
		this.getProcesos();
		this.getCuestiones();
	}

	guardar() {
		this._fodaService.insertaFODA(this.forma.value)
			.subscribe((data: any) => {
				this._accesoService.guardarStorage(data.token);
				swal('Atención!!!', data.message, 'success');
				this.forma.reset();
			},
			error => {
				console.error(error);
				swal('ERROR', error.error.message, 'error');
				if (error.error.code === 401) {
					this._accesoService.logout();
				}
			});
	}

	getProcesos() {
		this._fodaService.getProcesosFODA().subscribe((data: any) => {
			this.procesos = data.procesos;
		});
	}

	getCuestiones() {
		this._fodaService.getTipoFODA().subscribe((data: any) => {
			this.cuestiones = data.cuestiones;
		});
	}

}
