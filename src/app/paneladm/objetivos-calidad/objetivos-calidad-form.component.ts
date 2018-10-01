import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AccesoService, IdentidadService, HomeService } from '../../services/services.index';
import { Identidad } from '../../interfaces/identidad.interface';

@Component({
	selector: 'app-objetivos-calidad-form',
	templateUrl: './objetivos-calidad-form.component.html'
})

export class ObjetivosCalidadFormComponent implements OnInit, OnDestroy {

	private sub: any;
	accion: string;
	titulo: string;
	clave: number;
	identidad: Identidad;
	forma: FormGroup;
	cancelar: any[] = ['/paneladm', 'submenuident', 'ident_objetivos'];
	sistemas: any [] = [];
	seleccionado = '';

	constructor(private activatesRoute: ActivatedRoute, private router: Router,
				private _accesoService: AccesoService, private _identidad: IdentidadService, private _home: HomeService) {
		this.sub = this.activatesRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.clave = params['id'];
		});

		this.titulo = (this.accion === 'I' ? 'Registro de Objetivos de Calidad' : 'Actualización de Objetivos de Calidad');

		if (this.clave > 0) {
			this.cargarIdentidad(this.clave);
		}
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'clave' : new FormControl(),
			'sistema': new FormControl('', Validators.required),
			'tipo' : new FormControl('', Validators.required),
			'numero' : new FormControl('', Validators.required),
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
