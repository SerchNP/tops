import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AccesoService, ProcesosService, FichaProcesoService } from '../../../services/services.index';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-eas-proceso-formulario',
	templateUrl: './eas-proceso-formulario.component.html'
})
export class EASProcesoFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	id: number;
	autoriza: number;
	titulo: string;
	private _MENU = 'eas_proceso';
	cargando = false;
	forma: FormGroup;
	cancelar = ['/contexto', 'submenufichaproc', 'eas_proceso'];

	proceso_sel: number;
	procesos: any [] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private formBuilder: FormBuilder,
				private _acceso: AccesoService,
				private _proceso: ProcesosService,
				private _fichaproc: FichaProcesoService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
		});

		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';			  break;
			case 'U':	pre = 'Actualización';		  break;
			case 'V':	pre = 'Consulta';			  break;
		}

		this.titulo = pre + ' de Entradas, Actividades y Salidas del proceso';
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			proceso : new FormControl('', Validators.required),
			entradas : this.formBuilder.array([]),
			actividades : this.formBuilder.array([]),
			salidas : this.formBuilder.array([])
		});
		this.cargando = true;
		this.getProcesos();
		this.cargando = false;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get entradas() {
		return this.forma.get('entradas') as FormArray;
	}

	get actividades() {
		return this.forma.get('actividades') as FormArray;
	}

	get salidas() {
		return this.forma.get('salidas') as FormArray;
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario(this._MENU)
			.subscribe(
				(data: any) => {
					this.procesos = data.procesos;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	addEntrada() {
		this.entradas.push(this.createItemEAS(0, 'E', '', '', '', '')); // Las actividades son internas (I)
	}

	addActividad() {
		this.actividades.push(this.createItemEAS(0, 'A', '', '', '', 'I')); // Las actividades son internas (I)
	}

	addSalida() {
		this.salidas.push(this.createItemEAS(0, 'S', '', '', '', ''));
	}

	createItemEAS(clave, tipo, descrip, descrip_pdc, responsable, intext): FormGroup {
		return this.formBuilder.group({
			clave:			 new FormControl(clave, Validators.required),
			tipo:			 new FormControl(tipo, Validators.required), // E-Entrada, A-Actividad, S-Salida
			descripcion:	 new FormControl(descrip, Validators.required),
			descripcion_pdc: new FormControl(descrip_pdc, Validators.required),
			responsable:	 new FormControl(responsable, Validators.required),
			int_ext:		 new FormControl(intext, Validators.required), // E-Externo, I-Interno
		});
	}

	async guardar() {
		const listaEAS: any = [];
		if (this.entradas.length === 0) {
			swal('ERROR', 'Debe ingresar al menos una entrada para el proceso', 'error');
		} else if (this.actividades.length === 0) {
			swal('ERROR', 'Debe ingresar al menos una actividad para el proceso', 'error');
		} else if (this.salidas.length === 0) {
			swal('ERROR', 'Debe ingresar al menos una salida para el proceso', 'error');
		} else {
			this.subscription = this._fichaproc.insertarEASProceso(this.forma.value)
				.subscribe((data: any) => {
						swal('Atención!!!', data.message, 'success');
						const elemHTML: HTMLElement = document.getElementById('nav-est-tab');
						elemHTML.click();
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
		}
	}

}
