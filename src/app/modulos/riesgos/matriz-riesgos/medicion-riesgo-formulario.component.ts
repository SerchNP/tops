import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RiesgoService, AccesoService, DerechosService, CatalogosService } from '../../../services/services.index';
import { FiltraClavePipe } from '../../../pipes/filtra-clave.pipe';
import { Derechos } from '../../../interfaces/derechos.interface';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-medicion-riesgo-formulario',
	templateUrl: './medicion-riesgo-formulario.component.html'
})
export class MedicionRiesgoFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'matriz_riesgos';

	riesgoID: number;
	estado: number;
	registro: any = {};
	listado: any[] = [];
	cargando = false;
	titulo: string;
	cancelar: any [];
	select = false;
	allowMultiSelect = false;
	derechos: Derechos = {};
	accion: string;

	impactos: any [] = [];
	ocurrencias: any [] = [];
	niveles: any [] = [];
	ocurre: any;
	imp: any;
	nivl: any;

	forma: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
				public _derechos: DerechosService,
				private _riesgo: RiesgoService,
				private _acceso: AccesoService,
				private _catalogos: CatalogosService,
				private formBuilder: FormBuilder,
				private router: Router,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.riesgoID = Number(params['id']);
			this.accion = params['acc'];
			this.cancelar = ['/riesgos', 'trata_riesgo_form', 'U', this.riesgoID];
		});
		this.titulo = 'Registro de Medición';
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
			ocurrencia : new FormControl('', Validators.required),
			impacto : new FormControl('', Validators.required),
			valorc_o : new FormControl('', Validators.required),
			valorc_i : new FormControl('', Validators.required),
			valorc_t : new FormControl('', Validators.required),
			nivel : new FormControl('', Validators.required),
			observaciones: new FormControl('', Validators.required)
		});

		this.cargando = true;
		this.subscription = this.forma.controls['riesgo'].valueChanges
			.subscribe((riesgoSel) => {
				if (riesgoSel !== null && riesgoSel !== undefined) {
					this.getCatalogos();
				}
			});
		this.subscription = this.forma.controls['ocurrencia'].valueChanges
			.subscribe(ocurreSel => {
				if (ocurreSel !== null && ocurreSel !== undefined) {
					this.ocurre = new FiltraClavePipe().transform(this.ocurrencias, Number(ocurreSel));
				}
			});
		this.subscription = this.forma.controls['impacto'].valueChanges
			.subscribe(impSel => {
				if (impSel !== null && impSel !== undefined) {
					this.imp = new FiltraClavePipe().transform(this.impactos, Number(impSel));
					this.forma.get('valorc_i').setValue(this.imp[0].valor);
				}
			});
		this.subscription = this.forma.controls['nivel'].valueChanges
			.subscribe(nivSel => {
				if (nivSel !== null && nivSel !== undefined) {
					this.nivl = new FiltraClavePipe().transform(this.niveles, Number(nivSel));
				}
			});
		this.cargando = false;

	}

	get proceso () {
		return this.forma.get('proceso');
	}

	get proceso_desc () {
		return this.forma.get('proceso_desc');
	}

	get riesgo () {
		return this.forma.get('riesgo');
	}

	get riesgo_desc () {
		return this.forma.get('riesgo_desc');
	}

	get estado_desc () {
		return this.forma.get('estado_desc');
	}

	get ocurrencia () {
		return this.forma.get('ocurrencia');
	}

	get impacto () {
		return this.forma.get('impacto');
	}

	get valorc_o () {
		return this.forma.get('valorc_o');
	}

	get valorc_i () {
		return this.forma.get('valorc_i');
	}

	get valorc_t () {
		return this.forma.get('valorc_t');
	}

	get observaciones () {
		return this.forma.get('observaciones');
	}

	get nivel () {
		return this.forma.get('nivel');
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	getCatalogos () {
		this._catalogos.getImpactoRiesgo().then((data: any) => {
			this.impactos = data;
		}).catch(error => {
			console.log(error);
		});

		this._catalogos.getOcurrenciaRiesgo(this.registro.edo_riesgo).then((data: any) => {
			this.ocurrencias = data;
		}).catch(error => {
			console.log(error);
		});

		this._catalogos.getNivelesRiesgo().then((data: any) => {
			this.niveles = data;
		}).catch(error => {
			console.log(error);
		});
	}

	cargarRiesgo(riesgoID: number) {
		this.subscription = this._riesgo.getRiesgoById(riesgoID, '0')
			.subscribe(
				(data: any) => {
					this.registro = data.riesgo;
					this._acceso.guardarStorage(data.token);
					this.forma.patchValue(data.riesgo);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	async guardar () {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			// tslint:disable-next-line:max-line-length
			text: '¿Está seguro que desea guardar la medición para el riesgo "' + this.registro.riesgo_desc + '"?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			this.subscription = this._riesgo.insertarMedicionRiesgo(this.forma.value)
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
