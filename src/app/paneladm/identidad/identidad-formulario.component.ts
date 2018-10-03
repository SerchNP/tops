import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccesoService, IdentidadService, HomeService } from '../../services/services.index';
import { Identidad } from '../../interfaces/identidad.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-identidad-formulario',
	templateUrl: './identidad-formulario.component.html'
})

export class IdentidadFormularioComponent implements OnInit, OnDestroy {

	private sub: any;
	tipo_i: string;
	accion: string;
	clave: number;
	descripcion_sub: string;
	titulo: string;
	identidad: Identidad;
	forma: FormGroup;
	cancelar: any[];
	sistemas: any [] = [];
	sis_default: string;
	consec_default: string;
	seleccionado = '';

	constructor(private activatesRoute: ActivatedRoute, private router: Router,
				private _accesoService: AccesoService, private _identidad: IdentidadService, private _home: HomeService) {
		this.sub = this.activatesRoute.params.subscribe(params => {
			this.tipo_i = params['tipo'];
			this.accion = params['acc'];
			this.clave = params['id'];
			if (this.tipo_i === 'P' || this.tipo_i === 'N' || this.tipo_i === 'E') {
				this.sis_default = '1';
				this.consec_default = '0';
			} else {
				if (this.tipo_i === 'M' || this.tipo_i === 'V' || this.tipo_i === 'A') {
					this.sis_default = '';
					this.consec_default = '0';
				} else {
					this.sis_default = '';
					this.consec_default = '';
				}
			}
		});
		this.cancelar = ['/paneladm', 'submenuident', 'identidad_' + this.tipo_i.toLowerCase()];

		this.descripcion_sub = this.getDescripcion(this.tipo_i);
		this.titulo = (this.accion === 'I' ? 'Registro de ' + this.descripcion_sub : 'Actualización de ' + this.descripcion_sub);

		if (this.clave > 0) {
			this.cargarIdentidad(this.clave);
		}
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'clave' : new FormControl(),
			'sistema': new FormControl(this.sis_default, Validators.required),
			'tipo' : new FormControl(this.tipo_i, Validators.required),
			'numero' : new FormControl(this.consec_default, Validators.required),
			'descrip' : new FormControl('', Validators.required),
			'f_inicial' : new FormControl('', Validators.required),
			'f_final' : new FormControl()
		});
		this.getSistemas();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	get sistema() {
		return this.forma.get('sistema');
	}

	get tipo() {
		return this.forma.get('tipo');
	}

	getDescripcion(tipo: string) {
		let desc = '';
		switch (tipo) {
			case 'P' : desc = 'Política de Calidad'; break;
			case 'A' : desc = 'Alcance'; break;
			case 'M' : desc = 'Misión'; break;
			case 'V' : desc = 'Vision'; break;
			case 'N' : desc = 'Notas'; break;
			case 'O' : desc = 'Objetivos de Calidad'; break;
		}
		return desc;
	}

	getSistemas() {
		this._home.getSistemas().subscribe((data: any) => this.sistemas = data);
	}

	cargarIdentidad(clave: number) {
		this._identidad.getIdentidadById(clave)
			.subscribe(
				(data: any) => {
					this.identidad = data.identidad;
					this.forma.patchValue(this.identidad);
					this._accesoService.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	guardar() {
		if (this.accion === 'U') {
			this._identidad.modificarIdentidad(this.forma.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(this.cancelar);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		} else {
			this._identidad.insertarIdentidad(this.forma.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(this.cancelar);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		}
	}

}
