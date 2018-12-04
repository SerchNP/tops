import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OportunidadesService, AccesoService, DerechosService, PuestosService, ProcesosService } from '../../../services/services.index';
import { FiltraClavePipe } from '../../../pipes/filtra-clave.pipe';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-accion-oportunidad-formulario',
	templateUrl: './accion-oportunidad-formulario.component.html'
})
export class AccionOportunidadFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	private _MENU = 'oportunidades';

	registro: any = {};
	cargando = false;
	titulo: string;
	cancelar: any [] = ['/contexto', 'submenufichaproc', 'acciones_oportunidad'];
	accionID: number;
	accion_form: string;
	procesos: any[] = [];
	puestos: any [] = [];
	oportunidades: any [] = [];
	proceso_sel: number;

	forma: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
				private _acceso: AccesoService,
				public _derechos: DerechosService,
				private _oportunidad: OportunidadesService,
				private _proceso: ProcesosService,
				private _puestos: PuestosService,
				private router: Router,
				private formBuilder: FormBuilder) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accionID = Number(params['id']);
			this.accion_form = params['acc'];
		});
		let pre = '';
		switch (this.accion_form) {
			case 'I':	pre = 'Registro';		break;
			case 'U':	pre = 'Actualización';	break;
			case 'V':	pre = 'Consulta';		break;
		}
		this.titulo = pre + ' de Acciones';
		if (this.accionID !== 0) {
			this.cargarAccion(this.accionID);
		}
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			regid:  new FormControl(0, Validators.required),
			proceso : new FormControl('', Validators.required),
			origen_id : new FormControl('', Validators.required),
			accion_desc : new FormControl('', Validators.required),
			fecha_inicio : new FormControl('', Validators.required),
			responsable : new FormControl('', Validators.required),
			puesto : new FormControl('', Validators.required),
			observaciones : new FormControl('', Validators.required)
		});
		this.cargando = true;
		this.getProcesos();
		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {	// "procesoSel" representa la clave del proceso seleccionado
				this.oportunidades = [];
				if (procesoSel !== null && procesoSel !== undefined) {
					this.proceso_sel = procesoSel;
					this.getPuestos(procesoSel);
					this.getOportunidades(procesoSel);
				}
			});

		this.subscription = this.forma.controls['origen_id'].valueChanges
			.subscribe(opSel => {	// "opSel" representa la clave de la oportunidad seleccionada
				if (opSel !== null && opSel !== undefined) {
					this.registro = new FiltraClavePipe().transform(this.oportunidades, Number(opSel));
					if (this.registro.length > 0) {
						this.responsable.setValue(this.registro[0].responsable);
						this.puesto.setValue(this.registro[0].puesto);
					}
				}
			});
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	get regid () {
		return this.forma.get('regid');
	}

	get proceso () {
		return this.forma.get('proceso');
	}

	get accion_desc () {
		return this.forma.get('accion_desc');
	}

	get origen_id () {
		return this.forma.get('origen_id');
	}

	get fecha_inicio () {
		return this.forma.get('fecha_inicio');
	}

	get responsable () {
		return this.forma.get('responsable');
	}

	get puesto () {
		return this.forma.get('puesto');
	}

	get observaciones () {
		return this.forma.get('observaciones');
	}

	cargarAccion(accionID: number) {
		this.subscription = this._oportunidad.getAccionOportunidadById(accionID)
			.subscribe(
				(data: any) => {
					this.registro = data.accion;
					this._acceso.guardarStorage(data.token);
					this.forma.patchValue(data.accion);
					this.regid.setValue(data.accion.accion_id);
					this.getPuestos(data.accion.proceso);
					this.fecha_inicio.setValue(data.accion.f_inicio_d);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario(this._MENU)
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

	getPuestos(idProc) {
		this.subscription = this._puestos.getPuestosAreaProc(idProc).subscribe(
			(data: any) => {
				this.puestos = data.puestos;
			});
	}

	getOportunidades(idProc) {
		this.subscription = this._oportunidad.getOportunidadesByProceso(idProc).subscribe(
			(data: any) => {
				this.oportunidades = data.oportunidades;
				this._acceso.guardarStorage(data.token);
			});
	}

	async guardar() {
		if (this.accion_form === 'I') {
			this.subscription = this._oportunidad.insertarAccionOportunidad(this.forma.value)
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
		} else if (this.accion_form === 'U') {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: '¿Está seguro que desea guardar los cambios en la acción?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				this.subscription = this._oportunidad.editarAccionOportunidad(this.forma.value)
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

}
