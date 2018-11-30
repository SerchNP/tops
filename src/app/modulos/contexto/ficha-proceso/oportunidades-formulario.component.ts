import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { AccesoService, CatalogosService, ProcesosService,
		PuestosService, FichaProcesoService, FodaService } from '../../../services/services.index';
import { FiltraFodaAutPipe } from '../../../pipes/filtra-foda.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-oportunidades-formulario',
	templateUrl: './oportunidades-formulario.component.html'
})

export class OportunidadesFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	registroId: number;
	autoriza: string;
	invocador: string;
	s_guardar = true;
	titulo: string;
	cancelar: any[];
	cargando: boolean;

	procesos: any[] = [];
	listEASProc: any [] = [];
	listPuestos: any[] = [];
	listFODA: any [] = [];

	proceso_sel: number;
	origen_sel: string;

	forma: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private formBuilder: FormBuilder,
				private _acceso: AccesoService,
				private _catalogos: CatalogosService,
				private _proceso: ProcesosService,
				private _puestos: PuestosService,
				private _fichaproc: FichaProcesoService,
				private _foda: FodaService
				 /*,
		private _riesgo: RiesgoService,
		,
		*/
		) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.registroId = params['id'];
			this.autoriza = params['aut'];
			this.invocador = params['o'];
		});
		let pre = '';
		switch (this.accion) {
			case 'I': pre = 'Registro';	break;
			case 'U': pre = (this.invocador === 'M' ? 'Actualización' : 'Corrección'); break;
			case 'V': pre = 'Consulta'; this.s_guardar = false; break;
		}

		this.titulo = pre + ' de Oportunidades';

		if (this.invocador === 'M') {
			this.cancelar =  ['/contexto', 'submenufichaproc', 'oportunidades'];
		} else {
			this.cancelar = ['/contexto', 'submenufichaproc', 'autoriza_oportunidades', 'R']; // La edicion se habilita solo en el rechazo
		}

		if (this.registroId !== 0) {
			this.cargaRegistro(this.registroId);
		}
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			autoriza_desc: new FormControl(''),
			proceso : new FormControl('', Validators.required),
			origen : new FormControl('', Validators.required),
			easproc : new FormControl('', Validators.required),
			cuestionesA : this.formBuilder.array([]),
			cuestionesO : this.formBuilder.array([]),
			cuestionesD : this.formBuilder.array([]),
			cuestionesF : this.formBuilder.array([]),
			oportunidad : new FormControl(),
			oportunidad_desc : new FormControl('', Validators.required),
			responsable : new FormControl('', Validators.required),
			puesto : new FormControl('', Validators.required),
			fecha : new FormControl('', Validators.required)
		});

		this.cargando = true;
		this.listEASProc = [];
		this.listFODA = [];
		this.getProcesos();
		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {	// "procesoSel" representa la clave del proceso seleccionado
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
				if (procesoSel !== null) {
					this.proceso_sel = procesoSel;
					this.getPuestos(this.proceso_sel);
					if (this.origen_sel !== null || this.origen_sel !== undefined) {
						this.getEASProceso(this.proceso_sel, this.origen_sel);
					}
					this.subscription = this._foda.getFODAByProceso(procesoSel).subscribe(
						(data: any) => {
							this.listFODA = new FiltraFodaAutPipe().transform(data.foda, 3);
						});
				}
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	cargaRegistro(registroID) {

	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario('oportunidades')
			.subscribe(
				(data: any) => {
					this.procesos = data.procesos;
					console.log(this.procesos);
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
					this.listPuestos = data.puestos;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
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
					console.log(error);
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	guardar() {
		console.log(this.forma.value);
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get origen() {
		return this.forma.get('origen');
	}

	get easproc() {
		return this.forma.get('easproc');
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

	get responsable() {
		return this.forma.get('responsable');
	}

	get puesto() {
		return this.forma.get('puesto');
	}

}
