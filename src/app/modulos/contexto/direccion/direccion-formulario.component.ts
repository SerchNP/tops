import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AccesoService, ProcesosService, CatalogosService, FodaService } from '../../../services/services.index';
import { FiltraFodaAutPipe, FiltraFodaPipe } from '../../../pipes/filtra-foda.pipe';
import { FiltraTipoEstrategiaPipe } from '../../../pipes/filtra-tipo-estrategia.pipe';
import { Subscription } from 'rxjs';
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

	procesos: any[] = [];
	estrategias: any [] = [];
	estrateg: any;
	listFODA: any[] = [];
	listFODA_a: any[] = [];
	listFODA_b: any[] = [];
	listFODASel_a: any[] = [];
	listFODASel_b: any[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private formBuilder: FormBuilder,
				private _acceso: AccesoService,
				private _catalogos: CatalogosService,
				private _proceso: ProcesosService,
				private _foda: FodaService) {
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

		if (this.direccionId !== 0) {
			this.cargarDireccionEst(this.direccionId);
		}
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			proceso : new FormControl('', Validators.required),
			estrategia: new FormControl('', Validators.required),
			cuestiones_a : this.formBuilder.array([]),
			cuestiones_b : this.formBuilder.array([])
		});

		this.cargando = true;
		this.getProcesos();
		this.getCatalogos();
		this.cargando = false;

		this.subscription = this.forma.controls['proceso'].valueChanges
			.subscribe(procesoSel => {
				// "procesoSel" representa la clave del proceso seleccionado
				this.subscription = this._foda.getFODAByProceso(procesoSel).subscribe(
					(data: any) => {
						// Filtra foda por estatus de autorizacion
						this.listFODA = new FiltraFodaAutPipe().transform(data.foda, 3);
					});
			});
		this.subscription = this.forma.controls['estrategia'].valueChanges
			.subscribe(estrategiaSel => {
				while (this.cuestiones_a.length !== 0) {
					this.cuestiones_a.removeAt(0);
				}
				while (this.cuestiones_b.length !== 0) {
					this.cuestiones_b.removeAt(0);
				}
				this.estrateg = new FiltraTipoEstrategiaPipe().transform(this.estrategias, Number(estrategiaSel));
				if (this.estrateg.length > 0) {
					this.listFODA_a = new FiltraFodaPipe().transform(this.listFODA, this.estrateg[0].cuestion_a);
					this.listFODA_b = new FiltraFodaPipe().transform(this.listFODA, this.estrateg[0].cuestion_b);
				}
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
	}

	get estrategia() {
		return this.forma.get('estrategia');
	}

	get cuestiones_a() {
		return this.forma.get('cuestiones_a') as FormArray;
	}

	get cuestiones_b() {
		return this.forma.get('cuestiones_b') as FormArray;
	}

	cargarDireccionEst(direcccionId: number) {}

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

	guardar() {

	}

}
