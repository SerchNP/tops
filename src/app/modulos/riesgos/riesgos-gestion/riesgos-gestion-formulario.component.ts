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

	seleccionado = '';
	selectedValues: any[];

	procesos: any[] = [];
	listfoda: any [] = [];
	listfodaSel: any [] = [];

	forma: FormGroup;
	cancelar: any[] = ['/riesgos', 'riesgo_gestion'];

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
		});
		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';			  break;
			case 'U':	pre = 'Actualización';		  break;
			case 'V':	pre = 'Consulta';			  break;
			case 'A':	pre = 'Autorización/Rechazo'; break;
		}

		this.titulo = pre + ' de Riesgos de Gestión';

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
			cuestiones : this.formBuilder.array([]),
			autoriza_desc: new FormControl('')
			/*
			'motivo_cancela': new FormControl(''),
			'motivo_rechaza': new FormControl('')
			*/
		});

		this.cargando = true;
		this.getProcesos();
		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {
				// "procesoSel" representa la clave del proceso seleccionado,
				// por lo que hay que filtrar la lista de procesos para obtener
				// la clave del sistema a la que pertenece el proceso
				while (this.cuestiones.length !== 0) {
					this.cuestiones.removeAt(0);
				}
				this.subscription = this._foda.getFODAByProceso(procesoSel).subscribe(
					(data: any) => {
						this.listfoda = new FiltraFodaAutPipe().transform(data.foda, 3);
						this.listfoda.forEach((p) => this.addItem(p, this.listfodaSel));
					});
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get cuestiones() {
		return this.forma.get('cuestiones') as FormArray;
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

	addItem(p, listado): void {
		if (listado.length === 0) {
			this.cuestiones.push(this.createItem(p.proceso, false, p.foda, p.foda_desc, p.cuestion, p.tipo_cuestion_desc, p.orden));
		} else {
			let bandera = false;
			listado.forEach(element => {
				if (p.foda === element.foda) {
					bandera = true;
					return;
				}
			});
			// tslint:disable-next-line:max-line-length
			this.cuestiones.push(this.createItem(p.proceso, bandera, p.foda, p.foda_desc, p.cuestion, p.tipo_cuestion_desc, p.orden));
		}
	}

	createItem(proceso, b_foda, foda, fodadesc, cuestion, tipo_cuestion, orden): FormGroup {
		return this.formBuilder.group({
			proceso: proceso,
			foda: foda,
			b_foda: b_foda,
			foda_desc: fodadesc,
			cuestion: cuestion,
			tipo_cuestion_desc: tipo_cuestion,
			orden: orden
		});
	}

	guardar () {
		const listadoFinal: any = [];
		this.cuestiones.value.forEach(element => {
			if (element.b_foda === true) {
				listadoFinal.push(element);
			}
		});
		if (listadoFinal.length === 0) {
			swal('ERROR', 'Debe seleccionar al menos una Cuestión Externa/Interna ligada al proceso', 'error');
		} else {
			const valorForma = this.forma.value;
			valorForma.cuestiones = listadoFinal;

			if (this.accion === 'I') {
				this.subscription = this._riesgo.insertarRiesgoGestion(valorForma)
					.subscribe((data: any) => {
						swal('Atención!!!', data.message, 'success');
						this.ngOnInit();
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
			} else if (this.accion === 'U')  {
				this.subscription = this._riesgo.modificarRiesgoGestion(valorForma)
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

	async autorizar () {
		const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea autorizar '
				+ ((this.autoriza === '6' || this.autoriza === '8') ? 'la cancelación del' : 'el') + ' riesgo de gestión?',
			type: 'question',
			showCancelButton: true,
			confirmButtonText: 'Aceptar'
		});
		if (respuesta) {
			this.subscription = this._riesgo.autorizaRiesgoGestion(this.forma.value)
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
				+ ((this.autoriza === '6' || this.autoriza === '8') ? 'la cancelación del' : 'el') + ' riesgo de gestión?',
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
				this.subscription = this._riesgo.rechazaRiesgoGestion(this.riesgoId, motivo.toUpperCase())
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
