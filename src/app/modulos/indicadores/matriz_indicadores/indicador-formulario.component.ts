import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IndicadoresService, AccesoService, CatalogosService, IdentidadService, ProcesosService } from '../../../services/services.index';
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
	accion: string;
	idIndicador: number;
	autoriza: string;
	titulo: string;

	seleccionado = '';
	objetivoSel = '';
	items: any [] = [];

	procesos: any[] = [];
	formulas: any[] = [];
	frecuencias: any[] = [];
	resultados: any[] = [];
	objetivos: any[] = [];

	forma: FormGroup;
	cancelar: any[] = ['/indicadores', 'matriz_indicadores'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _indicador: IndicadoresService,
				private _procesos: ProcesosService,
				private _catalogos: CatalogosService,
				private _identidad: IdentidadService
				) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idIndicador = params['id'];
			this.autoriza = params['aut'];
		});
		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';			  break;
			case 'U':	pre = 'Actualización';		  break;
			case 'V':	pre = 'Consulta';			  break;
			case 'A':	pre = 'Autorización/Rechazo'; break;
		}

		this.titulo = pre + ' de Indicadores';

		if (this.idIndicador !== 0) {
			this.cargarIndicador(this.idIndicador);
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
			'autoriza_desc': new FormControl(''),
			'motivo_cancela': new FormControl(''),
			'motivo_rechaza': new FormControl('')
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
					});
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
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

	asignarproceso() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.forma.get('proceso').setValue(json.id);
			this.forma.get('proceso_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado el proceso', 'error');
		}
	}

	cargarIndicador(idIndicador: number) {
		this.subscription = this._indicador.getIndicadorById(idIndicador)
			.subscribe(
				(data: any) => {
					this._acceso.guardarStorage(data.token);
					this.forma.patchValue(data.indicador);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	guardar () {
		if (this.accion === 'U') {
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
		} else {
			this.subscription = this._indicador.insertarIndicador(this.forma.value)
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

	async autorizar () {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea autorizar '
				+ ((this.autoriza === '6' || this.autoriza === '8') ? 'la cancelación del' : 'el') + ' indicador?',
			type: 'question',
			showCancelButton: true,
			confirmButtonText: 'Aceptar'
		});
		if (respuesta) {
			this.subscription = this._indicador.autorizarIndicador(this.idIndicador)
				.subscribe((data: any) => {
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

	async rechazar () {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea rechazar '
				+ ((this.autoriza === '6' || this.autoriza === '8') ? 'la cancelación del' : 'el') + ' indicador?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			const {value: motivo} = await swal({
				title: 'Ingrese el motivo de rechazo',
				input: 'textarea',
				showCancelButton: true,
				inputValidator: (value) => {
					return !value && 'Necesita ingresar el motivo de rechazo';
				}
			});
			if (motivo !== undefined) {
				this.subscription = this._indicador.rechazarIndicador(this.idIndicador, motivo.toUpperCase())
					.subscribe((data: any) => {
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
}
