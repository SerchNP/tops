import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { RiesgoService, AccesoService, ProcesosService,
		FichaProcesoService, PuestosService, CatalogosService } from '../../../services/services.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-riesgos-operativos-formulario',
	templateUrl: './riesgos-operativos-formulario.component.html'
})
export class RiesgosOperativosFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	private TIPO_RIESGO = 'O';

	cargando: boolean;
	accion: string;
	riesgoId: number;
	autoriza: string;
	titulo: string;
	invocador: string;
	s_guardar = true;
	seleccionado = '';
	selectedValues: any[];
	procesos: any[] = [];
	proceso_sel: number;
	origen_sel: string;
	listEstadosR: any [] = [];
	listRiesgosG: any [] = [];

	listEASProc: any [] = [];
	listEASProcSel: any [] = [];
	listaPuestos: any [] = [];
	cancelar: any[];
	registro: any;

	forma: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _riesgo: RiesgoService,
				private _proceso: ProcesosService,
				private _fichaproc: FichaProcesoService,
				private _puestos: PuestosService,
				private _catalogos: CatalogosService,
				private formBuilder: FormBuilder) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.riesgoId = params['id'];
			this.autoriza = params['aut'];
			this.invocador = params['o'];
		});
		let pre = '';
		switch (this.accion) {
			case 'I': pre = 'Registro';	break;
			case 'U': pre = (this.invocador === 'M' ? 'Actualización' : 'Corrección'); break;
			case 'V': pre = 'Consulta'; this.s_guardar = false; break;
		}

		this.titulo = pre + ' de Riesgos Operativos';

		if (this.invocador === 'M') {
			this.cancelar =  ['/riesgos', 'riesgo_operativo'];
		} else {
			this.cancelar = ['/riesgos', 'autorizariesgoso_form', 'R']; // La edicion se habilita solo en el rechazo
		}

		if (this.riesgoId !== 0) {
			this.cargaRiesgo(this.riesgoId);
		}
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			proceso : new FormControl('', Validators.required),
			origen : new FormControl('', Validators.required),
			easproc : new FormControl('', Validators.required),
			riesgo : new FormControl(),
			predecesor : new FormControl('', Validators.required),
			tipo_riesgo : new FormControl('O'),
			riesgo_desc : new FormControl('', Validators.required),
			causas : this.formBuilder.array([]),
			consecuencias : this.formBuilder.array([]),
			responsable : new FormControl('', Validators.required),
			puesto_resp : new FormControl('', Validators.required),
			edo_riesgo : new FormControl('', Validators.required),
			autoriza_desc: new FormControl('')
		});

		this.cargando = true;
		this.listEASProc = [];
		this.listRiesgosG = [];
		this.getProcesos();
		this.getCatalogos();
		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {	// "procesoSel" representa la clave del proceso seleccionado
				while (this.causas.length !== 0) {
					this.causas.removeAt(0);
				}
				if (procesoSel !== null) {
					this.proceso_sel = procesoSel;
					this.getPuestos(procesoSel);
					this.getRiesgosProcesoByTipo(procesoSel);
					if (this.origen_sel !== null || this.origen_sel !== undefined) {
						this.getEASProceso(this.proceso_sel, this.origen_sel);
					}
				}
			});

		this.subscription = this.forma.controls['origen'].valueChanges
			.subscribe(origenSel => {	// "origenSel" es la clave del tipo de origen seleccionado
				if (origenSel !== null) {
					this.origen_sel = origenSel;
					if (this.proceso_sel !== null || this.proceso_sel !== undefined) {
						this.getEASProceso(this.proceso_sel, this.origen_sel);
					}
				}
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get origen() {
		return this.forma.get('origen');
	}

	get easproc() {
		return this.forma.get('easproc');
	}

	get predecesor () {
		return this.forma.get('predecesor');
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get edo_riesgo() {
		return this.forma.get('edo_riesgo');
	}

	get responsable() {
		return this.forma.get('responsable');
	}

	get puesto_resp() {
		return this.forma.get('puesto_resp');
	}

	get causas() {
		return this.forma.get('causas') as FormArray;
	}

	get consecuencias() {
		return this.forma.get('consecuencias') as FormArray;
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario('riesgo_operativo')
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

	getCatalogos() {
		this._catalogos.getEstadosRiesgo().then((data: any) => {
			this.listEstadosR = data;
		}).catch(error => {
			console.log(error);
		});
	}

	getEASProceso(proceso: number, tipo: string) {
		this.subscription = this._fichaproc.getEASProcesoByTipo(proceso, tipo)
			.subscribe(
				(data: any) => {
					this.listEASProc = data.easproc;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getRiesgosProcesoByTipo(idProc) {
		this.subscription = this._riesgo.getRiesgosProcesoByTipo('G', idProc)
			.subscribe(
				(data: any) => {
					this.listRiesgosG = data.riesgos;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getPuestos(idProc) {
		this.subscription = this._puestos.getPuestosAreaProc(idProc)
		.subscribe((data: any) => {
				this.listaPuestos = data.puestos;
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
					this.registro = data.riesgo;
					this._acceso.guardarStorage(data.token);
					// this.proceso.setValue(data.riesgo.proceso);
					this.forma.patchValue(data.riesgo);
					data.riesgo.causas.forEach(element => {
						this.causas.push(this.createItemCC(element.regid, element.descrip));
					});
					data.riesgo.consecuencias.forEach(element => {
						this.consecuencias.push(this.createItemCC(element.regid, element.descrip));
					});
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	addCausa() {
		this.causas.push(this.createItemCC(0, ''));
	}

	addConsecuencia() {
		this.consecuencias.push(this.createItemCC(0, ''));
	}

	createItemCC(clave, descrip): FormGroup {
		return this.formBuilder.group({
			clave:		 new FormControl(clave, Validators.required),
			descripcion: new FormControl(descrip, Validators.required)
		});
	}

	async delItem(pos: number, tipo: string) {
		let etiqueta = '';

		if (tipo === 'CA') {
			etiqueta = 'Causa';
		} else if (tipo === 'CO') {
			etiqueta = 'Consecuencia';
		}

		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: 'Está seguro que desea eliminar la ' + etiqueta + ' número ' + (pos + 1) + '?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta) {
			if (tipo === 'CA') {
				this.causas.removeAt(pos);
			} else if (tipo === 'CO') {
				this.consecuencias.removeAt(pos);
			}
		}
	}

	async guardar () {
		if (this.causas.length === 0) {
			swal('ERROR', 'Debe ingresar al menos una Causa del riesgo', 'error');
		} else if (this.consecuencias.length === 0) {
			swal('ERROR', 'Debe ingresar al menos una Consecuencia del riesgo', 'error');
		} else {
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
						/*this.subscription = this._riesgo.modificarRiesgoOperativo(this.forma.value, motivo.toUpperCase())
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
							});*/
					}
				/*} else {
					this.subscription = this._riesgo.modificarRiesgoOperativo(this.forma.value)
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
						});*/
				}
			} else {
				this.subscription = this._riesgo.insertarRiesgoOperativo(this.forma.value)
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
