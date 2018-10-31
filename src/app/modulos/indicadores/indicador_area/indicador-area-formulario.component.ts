import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IndicadoresService, AccesoService, CatalogosService, IdentidadService, ProcesosService } from '../../../services/services.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-indicador-area-formulario',
	templateUrl: './indicador-area-formulario.component.html',
	providers: [CatalogosService]
})
export class IndicadorAreaFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando: boolean;
	accion: string;
	idIndicador: number;
	titulo: string;

	seleccionado = '';
	objetivoSel = '';
	items: any [] = [];

	procesos: any[] = [];
	t_formulas: any[] = [];
	frecuencias: any[] = [];
	t_resultados: any[] = [];
	objetivos: any[] = [];

	forma: FormGroup;
	cancelar: any[] = ['/indicadores', 'indicador_area'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _indicadores: IndicadoresService,
				private _procesos: ProcesosService,
				private _catalogos: CatalogosService,
				private _identidad: IdentidadService
				) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idIndicador = params['id'];
		});
		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';		break;
			case 'U':	pre = 'Actualización';	break;
			case 'V':	pre = 'Consulta';		break;
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
			'frecuencia' : new FormControl('', Validators.required),
			'formula': new FormControl('', Validators.required),
			't_formula' : new FormControl('', Validators.required),
			't_resultado' : new FormControl('', Validators.required)
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

	get t_formula() {
		return this.forma.get('t_formula');
	}

	get t_resultado() {
		return this.forma.get('t_resultado');
	}

	getCatalogos() {
		this._catalogos.getFrecuencias().then((data: any) => {
			this.frecuencias = data;
		}).catch(error => {
			console.log(error);
		});

		this._catalogos.getFormulas().then((data: any) => {
			this.t_formulas = data;
		}).catch(error => {
			console.log(error);
		});

		this._catalogos.getResultados().then((data: any) => {
			this.t_resultados = data;
		}).catch(error => {
			console.log(error);
		});
	}

	getProcesos() {
		this.subscription = this._procesos.getProcesosUsuario('indicador_area')
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
		this.subscription = this._indicadores.getIndicadorById(idIndicador)
			.subscribe(
				(data: any) => {
					this.forma.patchValue(data.indicador);
					this._acceso.guardarStorage(data.token);
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
			this.subscription = this._indicadores.modificarIndicador(this.forma.value)
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
			this.subscription = this._indicadores.insertarIndicador(this.forma.value)
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
