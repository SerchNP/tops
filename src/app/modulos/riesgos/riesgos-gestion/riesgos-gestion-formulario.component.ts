import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RiesgoService, AccesoService, FodaService, ProcesosService } from '../../../services/services.index';
import { FiltraFodaAutPipe } from '../../../pipes/filtra-foda.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-riesgos-gestion-formulario',
	templateUrl: './riesgos-gestion-formulario.component.html',
	providers: []
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

	forma: FormGroup;
	cancelar: any[] = ['/riesgos', 'riesgo_gestion'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _riesgo: RiesgoService,
				private _proceso: ProcesosService,
				private _foda: FodaService) {
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
			// 'cuestiones' : new FormControl('', Validators.required),
			'cuestiones' : new FormArray([]),
			'autoriza_desc': new FormControl(''),
			'motivo_cancela': new FormControl(''),
			'motivo_rechaza': new FormControl('')
		});
		this.cargando = true;
		this.getProcesos();
		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {
				// "procesoSel" representa la clave del proceso seleccionado,
				// por lo que hay que filtrar la lista de procesos para obtener
				// la clave del sistema a la que pertenece el proceso
				this.subscription = this._foda.getFODAByProceso(procesoSel).subscribe(
					(data: any) => {
						this.listfoda = new FiltraFodaAutPipe().transform(data.foda, 3);
						this.listfoda.forEach(item => (<FormArray>this.forma.controls['cuestiones']).push(new FormControl(false)));
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
		return this.forma.get('cuestiones');
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
					this.forma.patchValue(data.riesgo);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	onCheckChange(event) {
		const formArray: FormArray = this.forma.get('cuestiones') as FormArray;
		/* Selected */
		if (event.source.checked) {
			// Add a new control in the arrayForm
			formArray.push(new FormControl(event.source.value));
		} else {
			/* unselected */
			// find the unselected element
			let i = 0;
			formArray.controls.forEach((ctrl: FormControl) => {
				if (ctrl.value === event.source.value) {
					// Remove the unselected element from the arrayForm
					formArray.removeAt(i);
					return;
				}
				i++;
			});
		}
	}

	guardar () {
		const formArray: FormArray = this.forma.get('cuestiones') as FormArray;
		const formArrayFinal: any = [];
		formArray.controls.forEach((ctrl: FormControl) => {
			if (ctrl.value !== true && ctrl.value !== false) {
				formArrayFinal.push(JSON.parse('{"proceso" : ' + this.forma.get('proceso').value + ', "foda" : ' + ctrl.value + '}'));
			}
		});
		const valorForma = this.forma.value;
		valorForma.cuestiones = formArrayFinal;
	}

	async autorizar () {
	}

	async rechazar () {
	}

}
