import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IndicadoresService, AccesoService, CatalogosService,
		IdentidadService, ProcesosService, PuestosService } from '../../../services/services.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-indicador-formulario',
	templateUrl: './indicador-formulario.component.html',
	providers: [CatalogosService]
})
export class IndicadorFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando: boolean;
	indicadorID: number;
	accion: string;
	autoriza: string;
	cambia = 'N';
	s_guardar = true;
	origen: string;
	titulo: string;
	cancelar: any[];

	seleccionado = '';
	objetivoSel = '';
	items: any [] = [];

	procesos: any[] = [];
	formulas: any[] = [];
	frecuencias: any[] = [];
	resultados: any[] = [];
	objetivos: any[] = [];
	puestos: any[] = [];

	forma: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _indicador: IndicadoresService,
				private _procesos: ProcesosService,
				private _catalogos: CatalogosService,
				private _identidad: IdentidadService,
				private _puesto: PuestosService
				) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.indicadorID = Number(params['id']);
			this.autoriza = params['aut'];
			this.origen = params['o'];
		});

		let pre = '';
		switch (this.accion) {
			case 'I': pre = 'Registro';	break;
			case 'U': pre = (this.origen === 'M' ? 'Actualización' : 'Corrección'); break;
			case 'V': pre = 'Consulta'; this.s_guardar = false; break;
		}

		this.titulo = pre + ' de Indicadores';

		if (this.origen === 'M') {
			this.cancelar = ['/indicadores', 'matriz_indicadores'];
		} else {
			this.cancelar = ['/indicadores', 'autorizaindica_form', 'R']; // La edicion se habilita solo en el rechazo
		}

		if (this.indicadorID !== 0) {
			this.cargarIndicador(this.indicadorID);
		}
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'proceso' : new FormControl('', Validators.required),
			'objetivo' : new FormControl('', Validators.required),
			'indicador' : new FormControl(),
			'indicador_desc' : new FormControl('', Validators.required),
			'tipo' : new FormControl('', Validators.required),
			'meta': new FormControl('', Validators.required),
			'valor_meta': new FormControl('', Validators.required),
			'frecuencia' : new FormControl('', Validators.required),
			'calculo': new FormControl('', Validators.required),
			'formula' : new FormControl('', Validators.required),
			'resultado' : new FormControl('', Validators.required),
			'puesto_resp': new FormControl('', Validators.required),
			'autoriza_desc': new FormControl(''),
			'motivo_cancela': new FormControl(''),
			'motivo_rechaza': new FormControl(''),
			'motivo_modif': new FormControl('')
		});
		this.cargando = true;
		this.getCatalogos();
		this.getProcesos();
		this.cargando = false;
		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {
				// "procesoSel" representa la clave del proceso seleccionado,
				// por lo que hay que filtrar la lista de procesos para obtener
				// la clave del sistema a la que pertenece el proceso
				this.subscription = this._procesos.getProcesoById(procesoSel).subscribe(
					(data: any) => {
						this.getObjetivos(data.proceso.sistema);
						this.getPuestos(data.proceso.proceso);
					});
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get puesto_resp() {
		return this.forma.get('puesto_resp');
	}

	get objetivo() {
		return this.forma.get('objetivo');
	}

	get tipo() {
		return this.forma.get('tipo');
	}

	get frecuencia() {
		return this.forma.get('frecuencia');
	}

	get formula() {
		return this.forma.get('formula');
	}

	get resultado() {
		return this.forma.get('resultado');
	}

	getCatalogos() {
		this._catalogos.getFrecuencias().then((data: any) => {
			this.frecuencias = data;
		}).catch(error => {
			console.log(error);
		});

		this._catalogos.getFormulas().then((data: any) => {
			this.formulas = data;
		}).catch(error => {
			console.log(error);
		});

		this._catalogos.getResultados().then((data: any) => {
			this.resultados = data;
		}).catch(error => {
			console.log(error);
		});
	}

	getProcesos() {
		this.subscription = this._procesos.getProcesosUsuario('matriz_indicadores')
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

	getObjetivos(sistema: number) {
		this.cargando = true;
		this.subscription = this._identidad.getIdentidad('V', sistema, 'O')
			.subscribe(
				(data: any) => {
					this.objetivos = data.identidad;
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getPuestos(proceso: number) {
		this.cargando = true;
		this.subscription = this._puesto.getPuestosAreaProc(proceso)
			.subscribe(
				(data: any) => {
					this.puestos = data.puestos;
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	cargarIndicador(id: number) {
		this.subscription = this._indicador.getIndicadorById(id)
			.subscribe(
				(data: any) => {
					this._acceso.guardarStorage(data.token);
					this.forma.patchValue(data.indicador);
					this.cambia = data.indicador.cambia;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	async guardar () {
		if (this.accion === 'U') {
			if (this.autoriza === '3') {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo del cambio',
					input: 'textarea',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo del cambio';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._indicador.modificarIndicador(this.forma.value, motivo.toUpperCase())
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
			} else {
				this.subscription = this._indicador.modificarIndicador(this.forma.value)
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
		} else {
			this.subscription = this._indicador.insertarIndicador(this.forma.value)
				.subscribe((data: any) => {
					this._acceso.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.objetivos = [];
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
