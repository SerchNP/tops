import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AccesoService, ProcesosService, CatalogosService,
		FodaService, IdentidadService, DireccionService, PuestosService } from '../../../services/services.index';
import { FiltraFodaAutPipe, FiltraFodaPipe } from '../../../pipes/filtra-foda.pipe';
import { FiltraTipoEstrategiaPipe } from '../../../pipes/filtra-tipo-estrategia.pipe';
import { Subscription } from 'rxjs';
import { merge } from 'rxjs/observable/merge';
import swal from 'sweetalert2';

@Component({
	selector: 'app-direccion-formulario',
	templateUrl: './direccion-formulario.component.html',
})

export class DireccionFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	direccionId: number;
	autoriza: number;
	titulo: string;

	cargando = false;
	forma: FormGroup;
	cancelar = ['/contexto', 'submenudirest', 'direccion'];

	procesos: any[] = [];
	estrategias: any [] = [];
	estrateg: any;
	listFODA: any[] = [];
	listFODA_a: any[] = [];
	listFODA_b: any[] = [];
	listFODASel_a: any[] = [];
	listFODASel_b: any[] = [];
	listaEjes: any[] = [];
	listaEjesSel: any[] = [];
	listaLineas: any[] = [];
	listaPuestos: any[] = [];

	registro: any;
	bandera = false;

	proceso_sel: number;
	estrategia_sel: number;
	cuestiona_sel: number;
	cuestionb_sel: number;


	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private formBuilder: FormBuilder,
				private _acceso: AccesoService,
				private _catalogos: CatalogosService,
				private _puestos: PuestosService,
				private _proceso: ProcesosService,
				private _foda: FodaService,
				private _identidad: IdentidadService,
				private _direccion: DireccionService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.direccionId = params['id'];
			this.autoriza = params['aut'];
		});

		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';			  break;
			case 'U':	pre = 'Actualización';		  break;
			case 'V':	pre = 'Consulta';			  break;
		}

		this.titulo = pre + ' de Dirección Estratégica';
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			regid : new FormControl(),
			proceso : new FormControl('', Validators.required),
			estrategia: new FormControl('', Validators.required),
			foda_a : new FormControl('', Validators.required),
			foda_b : new FormControl('', Validators.required),
			ejes : this.formBuilder.array([]),
			lineas : this.formBuilder.array([])
		});

		this.cargando = true;
		this.getProcesos();
		this.getCatalogos();

		if (Number(this.direccionId) !== 0) {
			this.cargarDireccionEst(this.direccionId);
		}

		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {	// "procesoSel" representa la clave del proceso seleccionado
				if (procesoSel !== null) {
					this.proceso_sel = procesoSel;
					this.getCuestiones(this.proceso.value);
					this.getPuestos(procesoSel);
				}
			});
		this.subscription = this.forma.controls['estrategia'].valueChanges
			.subscribe(estrategiaSel => {
				this.estrategia_sel = estrategiaSel;
				this.estrateg = new FiltraTipoEstrategiaPipe().transform(this.estrategias, Number(estrategiaSel));
				if (this.estrateg.length > 0) {
					this.listFODA_a = new FiltraFodaPipe().transform(this.listFODA, this.estrateg[0].cuestion_a);
					this.listFODA_b = new FiltraFodaPipe().transform(this.listFODA, this.estrateg[0].cuestion_b);
					if (this.registro !== undefined) {
						this.foda_a.setValue(this.registro.foda_a);
						this.foda_b.setValue(this.registro.foda_b);
					}
				}
			});
		this.subscription = this.forma.controls['foda_a'].valueChanges.subscribe(cuestionASel => {
			this.cuestiona_sel = cuestionASel;
		});
		this.subscription = this.forma.controls['foda_b'].valueChanges.subscribe(cuestionBSel => {
			this.cuestionb_sel = cuestionBSel;
		});

		merge(
			this.forma.get('proceso').valueChanges,
			this.forma.get('estrategia').valueChanges,
			this.forma.get('foda_a').valueChanges,
			this.forma.get('foda_b').valueChanges
		).subscribe(() => {
			if (this.proceso_sel > 0 && this.estrategia_sel > 0 && this.cuestiona_sel > 0 && this.cuestionb_sel > 0) {
				if (this.bandera === false) {
					this.getEjesSeleccionados(this.proceso_sel, this.estrategia_sel, this.cuestiona_sel, this.cuestionb_sel);
				}
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get regid() {
		return this.forma.get('regid');
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get estrategia() {
		return this.forma.get('estrategia');
	}

	get foda_a() {
		return this.forma.get('foda_a'); // as FormArray;
	}

	get foda_b() {
		return this.forma.get('foda_b'); // as FormArray;
	}

	get ejes() {
		return this.forma.get('ejes') as FormArray;
	}

	get lineas() {
		return this.forma.get('lineas') as FormArray;
	}

	cargarDireccionEst(direcccionId: number) {
		this.subscription = this._direccion.getDireccionEstById(direcccionId)
			.subscribe(
				(data: any) => {
					this.registro = data.direccionest;
					this.regid.setValue(this.registro.regid);
					this.proceso.setValue(this.registro.proceso);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario('direccion')
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
		this._catalogos.getTipoEstrategia().then((data: any) => {
			this.estrategias = data;
		}).catch(error => {
			console.log(error);
		});
	}

	getCuestiones(idProc) {
		this.subscription = this._foda.getFODAByProceso(idProc).subscribe(
			(data: any) => {
				// Filtra foda por estatus de autorizacion
				this.listFODA = new FiltraFodaAutPipe().transform(data.foda, 3);
				if (this.registro !== undefined && this.registro.estrategia !== undefined) {
					this.estrategia.setValue(this.registro.estrategia);
				}
			});
	}

	getPuestos(idProc) {
		this._puestos.getPuestosAreaProc(idProc).subscribe(
			(data: any) => {
				// Filtra foda por estatus de autorizacion
				this.listaPuestos = data.puestos;
			});
	}

	getEjes() {
		while (this.ejes.length !== 0) {
			this.ejes.removeAt(0);
		}
		this.subscription = this._identidad.getIdentidad('I', 1, 'E')
			.subscribe(
				(data: any) => {
					this.listaEjes = data.identidad;
					this._acceso.guardarStorage(data.token);
					this.listaEjes.forEach((p) => this.addItemEjes(p, this.listaEjesSel));
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getEjesSeleccionados(idProc, idEst, idFA, idFB) {
		this.bandera = true;
		if (Number(this.direccionId) === 0) {
			this.subscription = this._direccion.getIdFromDireccion(idProc, idEst, idFA, idFB)
				.subscribe(
					(data: any) => {
						this._acceso.guardarStorage(data.token);
						this.regid.setValue(data.idDE);
						if (this.regid.value === 0) {
							this.listaEjesSel = [];
							this.getEjes();
						} else {
							this.subscription = this._direccion.getEjesFromDireccionEstById(this.regid.value)
								.subscribe(
									(dataED: any) => {
										this.listaEjesSel = dataED.ejes;
										this._acceso.guardarStorage(dataED.token);
										this.getEjes();
										this.getLineas(this.regid.value);
									},
									error => {
										swal('ERROR', error.error.message, 'error');
										if (error.error.code === 401) {
											this._acceso.logout();
										}
									});
						}
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
		} else {
			this.subscription = this._direccion.getEjesFromDireccionEstById(this.regid.value)
				.subscribe(
					(dataED: any) => {
						this.listaEjesSel = dataED.ejes;
						this._acceso.guardarStorage(dataED.token);
						this.getEjes();
						this.getLineas(this.regid.value);
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
		}
	}

	getLineas(idDE) {
		this.subscription = this._direccion.getLineasFromDireccionEstById(idDE)
			.subscribe(
				(data: any) => {
					this.listaLineas = data.lineas;
					this._acceso.guardarStorage(data.token);
					this.listaLineas.forEach((p) => {
						this.addItemLineas(p);
					});
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	addItemEjes(p, listado): void {
		if (listado.length === 0) {
			this.ejes.push(this.createItemEjes(p.clave, false, p.numero, p.descrip));
		} else {
			let bandera = false;
			listado.forEach(element => {
				if (p.clave === element.eje_id) {
					bandera = true;
					return;
				}
			});
			this.ejes.push(this.createItemEjes(p.clave, bandera, p.numero, p.descrip));
		}
	}

	createItemEjes(clave, b_eje, numero, descrip): FormGroup {
		return this.formBuilder.group({
			clave: clave,
			b_eje: b_eje,
			numero: numero,
			descrip: descrip
		});
	}

	addItemLineas(p): void {
		this.lineas.push(this.createItemLineas(p.linea, p.linea_desc, p.f_inicio_d, p.responsable, p.puesto_resp));
	}

	addLinea() {
		this.lineas.push(this.createItemLineas(0, '', '', '', ''));
	}

	createItemLineas(linea, linea_desc, f_inicio, responsable, puesto): FormGroup {
		return this.formBuilder.group({
			linea:			new FormControl(linea, Validators.required),
			linea_desc:		new FormControl(linea_desc, Validators.required),
			fecha:			new FormControl(f_inicio, Validators.required),
			responsable:	new FormControl(responsable, Validators.required),
			puesto:			new FormControl(puesto, Validators.required)
		});
	}

	guardar() {
		const lfEjes: any = [];
		this.ejes.value.forEach(element => {
			if (element.b_eje === true) {
				lfEjes.push(element.clave);
			}
		});
		if (lfEjes.length === 0) {
			swal('ERROR', 'Debe seleccionar al menos un Eje Estratégico ligado a la Dirección Estratégica', 'error');
		} else {
			if (this.lineas.length === 0) {
				swal('ERROR', 'Debe ingresar al menos una Línea de Acción ligada a la Dirección Estratégica', 'error');
			} else {
				const valorForma = this.forma.value;
				valorForma.ejes_estrateg = lfEjes;

				if (this.regid.value > 0) {
					this.subscription = this._direccion.editaDireccionEst(valorForma)
						.subscribe(
							(data: any) => {
								swal('Atención!!!', data.message, 'success');
								/*this.listFODA_a = [];
								this.listFODA_b = [];
								const elemHTML: HTMLElement = document.getElementById('nav-est-tab');
								elemHTML.click();
								this.ngOnInit();*/
								this.router.navigate(['/contexto', 'submenudirest', 'direccion']);
							},
							error => {
								swal('ERROR', error.error.message, 'error');
								if (error.error.code === 401) {
									this._acceso.logout();
								}
							});
				} else {
					this.subscription = this._direccion.insertaDireccionEst(valorForma)
						.subscribe((data: any) => {
								swal('Atención!!!', data.message, 'success');
								this.listFODA_a = [];
								this.listFODA_b = [];
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
	}

}
