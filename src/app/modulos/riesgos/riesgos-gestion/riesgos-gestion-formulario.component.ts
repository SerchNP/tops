import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { RiesgoService, AccesoService, FodaService, ProcesosService } from '../../../services/services.index';
import { FiltraFodaAutPipe } from '../../../pipes/filtra-foda.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-riesgos-gestion-formulario',
	templateUrl: './riesgos-gestion-formulario.component.html'
})
export class RiesgosGestionFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	private TIPO_RIESGO = 'G';

	cargando: boolean;
	accion: string;
	riesgoId: number;
	autoriza: string;
	titulo: string;
	origen: string;
	s_guardar = true;
	seleccionado = '';
	selectedValues: any[];
	procesos: any[] = [];
	listfoda: any [] = [];
	listfodaSel: any [] = [];
	cancelar: any[];

	forma: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _riesgo: RiesgoService,
				private _proceso: ProcesosService,
				private _foda: FodaService,
				private formBuilder: FormBuilder) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.riesgoId = params['id'];
			this.autoriza = params['aut'];
			this.origen = params['o'];
		});
		let pre = '';
		switch (this.accion) {
			case 'I': pre = 'Registro';	break;
			case 'U': pre = (this.origen === 'M' ? 'Actualización' : 'Corrección'); break;
			case 'V': pre = 'Consulta'; this.s_guardar = false; break;
		}

		this.titulo = pre + ' de Riesgos de Gestión';

		if (this.origen === 'M') {
			this.cancelar =  ['/riesgos', 'riesgo_gestion'];
		} else {
			this.cancelar = ['/riesgos', 'autorizariesgosg_form', 'R']; // La edicion se habilita solo en el rechazo
		}

		if (this.riesgoId !== 0) {
			this.cargaRiesgo(this.riesgoId);
		}
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			proceso : new FormControl('', Validators.required),
			riesgo : new FormControl(),
			tipo_riesgo : new FormControl('G'),
			riesgo_desc : new FormControl('', Validators.required),
			cuestionesA : this.formBuilder.array([]),
			cuestionesO : this.formBuilder.array([]),
			cuestionesD : this.formBuilder.array([]),
			cuestionesF : this.formBuilder.array([]),
			autoriza_desc: new FormControl('')
		});

		this.cargando = true;
		this.getProcesos();
		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {
				// "procesoSel" representa la clave del proceso seleccionado,
				// por lo que hay que filtrar la lista de procesos para obtener
				// la clave del sistema a la que pertenece el proceso
				while (this.cuestionesA.length !== 0) {
					this.cuestionesA.removeAt(0);
				}
				while (this.cuestionesO.length !== 0) {
					this.cuestionesO.removeAt(0);
				}
				while (this.cuestionesD.length !== 0) {
					this.cuestionesD.removeAt(0);
				}
				while (this.cuestionesF.length !== 0) {
					this.cuestionesF.removeAt(0);
				}
				this.subscription = this._foda.getFODAByProceso(procesoSel).subscribe(
					(data: any) => {
						this.listfoda = new FiltraFodaAutPipe().transform(data.foda, 3);
					});
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get cuestionesA() {
		return this.forma.get('cuestionesA') as FormArray;
	}

	get cuestionesO() {
		return this.forma.get('cuestionesO') as FormArray;
	}

	get cuestionesD() {
		return this.forma.get('cuestionesD') as FormArray;
	}

	get cuestionesF() {
		return this.forma.get('cuestionesF') as FormArray;
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario('riesgo_gestion')
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

	cargaRiesgo(riesgoId: number) {
		this.subscription = this._riesgo.getRiesgoById(riesgoId, this.TIPO_RIESGO)
			.subscribe(
				(data: any) => {
					this._acceso.guardarStorage(data.token);
					this.listfodaSel = data.riesgo.cuestiones;
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
		const listadoFinal: any = [];
		this.cuestionesA.value.forEach(element => {
			if (element.b_foda === true) {
				listadoFinal.push(element);
			}
		});
		this.cuestionesO.value.forEach(element => {
			if (element.b_foda === true) {
				listadoFinal.push(element);
			}
		});
		this.cuestionesD.value.forEach(element => {
			if (element.b_foda === true) {
				listadoFinal.push(element);
			}
		});
		this.cuestionesF.value.forEach(element => {
			if (element.b_foda === true) {
				listadoFinal.push(element);
			}
		});
		if (listadoFinal.length === 0) {
			swal('ERROR', 'Debe seleccionar al menos una Cuestión Externa/Interna ligada al riesgo', 'error');
		} else {
			const valorForma = this.forma.value;
			valorForma.cuestiones = listadoFinal;

			if (this.accion === 'U')  {
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
						this.subscription = this._riesgo.modificarRiesgoGestion(valorForma, motivo.toUpperCase())
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
					this.subscription = this._riesgo.modificarRiesgoGestion(valorForma)
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
				this.subscription = this._riesgo.insertarRiesgoGestion(valorForma)
					.subscribe((data: any) => {
						this._acceso.guardarStorage(data.token);
						swal('Atención!!!', data.message, 'success');
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

}
