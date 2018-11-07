import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RiesgoService, AccesoService, CatalogosService, FodaService, ProcesosService } from '../../../services/services.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { FiltraFodaPipe } from '../../../pipes/filtra-foda.pipe';

@Component({
	selector: 'app-riesgos-gestion-formulario',
	templateUrl: './riesgos-gestion-formulario.component.html',
	providers: [CatalogosService]
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
	items: any [] = [];

	procesos: any[] = [];
	cuestiones: any [] = [];
	foda: any [] = [];

	forma: FormGroup;
	cancelar: any[] = ['/riesgos', 'riesgo_gestion'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _riesgo: RiesgoService,
				private _proceso: ProcesosService,
				private _foda: FodaService,
				private _catalogos: CatalogosService) {
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
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'proceso' : new FormControl('', Validators.required),
			'riesgo' : new FormControl(),
			'riesgo_desc' : new FormControl('', Validators.required),
			'tipo_cuestion' : new FormControl('', Validators.required),
			'foda' : new FormControl('', Validators.required),
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
				this.subscription = this._foda.getFODAByProceso(procesoSel).subscribe(
					(data: any) => {
						this.foda = data.foda;
					});
			});

		this.forma.controls['tipo_cuestion'].valueChanges
			.subscribe(tipoCuestionSel => {
				this.items = new FiltraFodaPipe().transform(this.foda, tipoCuestionSel, 3);
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get tipo_cuestion() {
		return this.forma.get('tipo_cuestion');
	}

	getCatalogos() {
		this._catalogos.getTipoCuestion().then((data: any) => {
			this.cuestiones = data;
		}).catch(error => {
			console.log(error);
		});
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

	asignarFODA() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.forma.get('foda').setValue(json.id);
			this.forma.get('foda_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado la Cuestion Externa/Interna', 'error');
		}
	}

	cargaRiesgo(riesgoId: number) {
		this.subscription = this._riesgo.getRiesgoById(riesgoId, this.TIPO_RIESGO)
			.subscribe(
				(data: any) => {
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

	guardar () {
		/*if (this.accion === 'U') {
			this.subscription = this._riesgo.modificarriesgo(this.forma.value)
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
			this.subscription = this._riesgo.insertarriesgo(this.forma.value)
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
		}*/
	}

	async autorizar () {
		/*const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea autorizar '
				+ ((this.autoriza === '6' || this.autoriza === '8') ? 'la cancelación del' : 'el') + ' riesgo?',
			type: 'question',
			showCancelButton: true,
			confirmButtonText: 'Aceptar'
		});
		if (respuesta) {
			this.subscription = this._riesgo.autorizarriesgo(this.riesgoId)
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
		}*/
	}

	async rechazar () {
		/*const {value: respuesta} = await swal({
			title: 'Atención!!!',
			text: '¿Está seguro que desea rechazar '
				+ ((this.autoriza === '6' || this.autoriza === '8') ? 'la cancelación del' : 'el') + ' riesgo?',
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
				this.subscription = this._riesgo.rechazarriesgo(this.riesgoId, motivo.toUpperCase())
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
		}*/
	}

}
