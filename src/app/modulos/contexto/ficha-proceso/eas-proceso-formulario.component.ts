import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccesoService, ProcesosService } from '../../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-eas-proceso-formulario',
	templateUrl: './eas-proceso-formulario.component.html'
})
export class EASProcesoFormularioComponent implements OnInit {

	private subscription: Subscription;

	accion: string;
	id: number;
	autoriza: number;
	titulo: string;
	private _MENU = 'eas_proceso';
	cargando = false;
	forma: FormGroup;
	cancelar = ['/contexto', 'submenufichaproc', 'eas_proceso'];

	procesos: any [] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private formBuilder: FormBuilder,
				private _acceso: AccesoService,
				private _proceso: ProcesosService) {
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
			tipo : new FormControl('', Validators.required),
			proceso : new FormControl('', Validators.required)
		});
		this.cargando = true;
		this.getProcesos();
		this.cargando = false;
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get tipo() {
		return this.forma.get('tipo');
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

	guardar() {
	}

}
