import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PuestosService, DireccionService, AccesoService } from '../../../services/services.index';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-linea-accion-formulario',
	templateUrl: './linea-accion-formulario.component.html'
})
export class LineaAccionFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	id: number;
	autoriza: number;
	titulo: string;

	cargando = false;
	forma: FormGroup;
	cancelar = ['/contexto', 'submenudirest', 'lineas_accion'];
	registro: any;

	puestos: any[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private formBuilder: FormBuilder,
				private _puestos: PuestosService,
				private _acceso: AccesoService,
				private _direccion: DireccionService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.id = params['id'];
			this.autoriza = params['aut'];
		});

		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';			  break;
			case 'U':	pre = 'Seguimiento';		  break;
			case 'V':	pre = 'Consulta';			  break;
		}

		this.titulo = pre + ' de Línea de Acción';
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			linea : new FormControl(),
			linea_desc : new FormControl('', Validators.required),
			proceso_desc: new FormControl(),
			estrategia_desc: new FormControl(),
			cuestion_a_desc: new FormControl(),
			cuestion_b_desc: new FormControl(),
			f_revision: new FormControl('', Validators.required),
			responsable: new FormControl('', Validators.required),
			puesto_resp: new FormControl('', Validators.required),
			evidencia: new FormControl('', Validators.required)
		});

		this.cargando = true;
		if (Number(this.id) !== 0) {
			this.cargaLineaAccionDE(this.id);
			this.subscription = this.forma.controls['linea'].valueChanges
				.subscribe(reg => {
					if (reg !== null) {
						this.getPuestos(this.registro.proceso);
					}
				});
		}

		this.cargando = false;
	}

	cargaLineaAccionDE(regid: number) {
		this.subscription = this._direccion.getLineaById(regid)
			.subscribe(
				(data: any) => {
					this.registro = data.linea;
					this.linea.setValue(this.registro.linea);
					this.linea_desc.setValue(this.registro.linea_desc);
					this.proceso_desc.setValue(this.registro.proceso_desc);
					this.estrategia_desc.setValue(this.registro.estrategia_desc);
					this.cuestion_a_desc.setValue(this.registro.cuestion_a_desc);
					this.cuestion_b_desc.setValue(this.registro.cuestion_b_desc);
					this.responsable.setValue(this.registro.responsable);
					this.puesto_resp.setValue(this.registro.puesto_resp);
					this.f_revision.setValue(this.registro.f_revision_d);
					this.evidencia.setValue(this.registro.evidencia);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get linea() {
		return this.forma.get('linea');
	}

	get linea_desc() {
		return this.forma.get('linea_desc');
	}

	get proceso_desc() {
		return this.forma.get('proceso_desc');
	}

	get estrategia_desc() {
		return this.forma.get('estrategia_desc');
	}

	get cuestion_a_desc() {
		return this.forma.get('cuestion_a_desc');
	}

	get cuestion_b_desc() {
		return this.forma.get('cuestion_b_desc');
	}

	get responsable() {
		return this.forma.get('responsable');
	}

	get puesto_resp() {
		return this.forma.get('puesto_resp');
	}

	get f_revision() {
		return this.forma.get('f_revision');
	}

	get evidencia() {
		return this.forma.get('evidencia');
	}

	getPuestos(idProc) {
		this._puestos.getPuestosAreaProc(idProc).subscribe(
			(data: any) => {
				this.puestos = data.puestos;
			});
	}

	guardar() {
		/*this.subscription = this._direccion.insertaDireccionEst(valorForma)
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
				});*/
	}

}
