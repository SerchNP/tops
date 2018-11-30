import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { RiesgoService, AccesoService, DerechosService, CatalogosService, PuestosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Riesgo } from '../../../interfaces/riesgo.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-accion-riesgo-formulario',
	templateUrl: './accion-riesgo-formulario.component.html'
})
export class AccionRiesgoFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'matriz_riesgos';

	riesgoID: number;
	registro: Riesgo = {};
	cargando = false;
	titulo: string;
	cancelar: any [];
	derechos: Derechos = {};
	accion_form: string;

	cat_acciones: any [] = [];
	cat_puestos: any [] = [];

	forma: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
				private _acceso: AccesoService,
				public _derechos: DerechosService,
				private _riesgo: RiesgoService,
				private _catalogos: CatalogosService,
				private _puestos: PuestosService,
				private router: Router,
				private formBuilder: FormBuilder,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.riesgoID = Number(params['id']);
			this.accion_form = params['acc'];
			this.cancelar = ['/riesgos', 'trata_riesgo_form', 'U', this.riesgoID];
		});
		this.titulo = 'Registro de Acciones';
		if (this.riesgoID !== 0) {
			this.cargarRiesgo(this.riesgoID);
		}
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			proceso : new FormControl(''),
			proceso_desc : new FormControl(''),
			riesgo : new FormControl(0, Validators.required),
			riesgo_desc : new FormControl(''),
			estado_desc : new FormControl(''),
			tipo_accion : new FormControl('', Validators.required),
			accion : new FormControl('', Validators.required),
			fecha_inicio : new FormControl('', Validators.required),
			responsable_linea : new FormControl('', Validators.required),
			puesto_linea : new FormControl('', Validators.required),
			observaciones : new FormControl('', Validators.required)
		});

		this.cargando = true;
		this.getCatalogos();
		this.cargando = false;
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	get proceso () {
		return this.forma.get('proceso');
	}

	get tipo_accion () {
		return this.forma.get('tipo_accion');
	}

	get accion () {
		return this.forma.get('accion');
	}

	get fecha_inicio () {
		return this.forma.get('fecha_inicio');
	}

	get responsable_linea () {
		return this.forma.get('responsable_linea');
	}

	get puesto_linea () {
		return this.forma.get('puesto_linea');
	}

	get observaciones () {
		return this.forma.get('observaciones');
	}

	getCatalogos () {
		this._catalogos.getTipoAccion(20).then((data: any) => {
			this.cat_acciones = data;
		}).catch(error => {
			console.log(error);
		});
	}

	cargarPuestos(proc) {
		this._puestos.getPuestosAreaProc(proc)
			.subscribe(
				(data: any) => {
					this.cat_puestos = data.puestos;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	cargarRiesgo(riesgoID: number) {
		this.subscription = this._riesgo.getRiesgoById(riesgoID, '0')
			.subscribe(
				(data: any) => {
					this.registro = data.riesgo;
					this._acceso.guardarStorage(data.token);
					this.forma.patchValue(data.riesgo);
					this.cargarPuestos(data.riesgo.proceso);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	async guardar() {
		console.log(this.forma.value);
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			// tslint:disable-next-line:max-line-length
			text: '¿Está seguro que desea guardar la acción para el riesgo "' + this.registro.riesgo_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			this.subscription = this._riesgo.insertarAccionRiesgo(this.forma.value)
				.subscribe((data: any) => {
					this._acceso.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(this.cancelar);
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
