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
			this.autoriza = Number (params['aut']);
		});

		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';			  break;
			case 'U':	pre = 'Seguimiento';		  break;
			case 'V':	pre = 'Consulta';			  break;
		}

		this.titulo = pre + ' Línea de Acción de Dirección Estratégica';
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			autoriza_desc: new FormControl(),
			linea : new FormControl(),
			linea_desc : new FormControl('', Validators.required),
			proceso_desc: new FormControl(),
			estrategia_desc: new FormControl(),
			cuestion_a_desc: new FormControl(),
			cuestion_b_desc: new FormControl(),
			fecha: new FormControl('', Validators.required),
			f_revision: new FormControl('', Validators.required),
			responsable: new FormControl('', Validators.required),
			puesto: new FormControl('', Validators.required),
			evidencia: new FormControl('', Validators.required),
			u_cancela: new FormControl(),
			f_cancela: new FormControl(),
			motivo_cancela: new FormControl()
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
					this.autoriza_desc.setValue(this.registro.autoriza_desc);
					this.linea.setValue(this.registro.linea);
					this.linea_desc.setValue(this.registro.linea_desc);
					this.proceso_desc.setValue(this.registro.proceso_desc);
					this.estrategia_desc.setValue(this.registro.estrategia_desc);
					this.cuestion_a_desc.setValue(this.registro.cuestion_a_desc);
					this.cuestion_b_desc.setValue(this.registro.cuestion_b_desc);
					this.responsable.setValue(this.registro.responsable);
					this.puesto.setValue(this.registro.puesto_resp);
					this.fecha.setValue(this.registro.f_inicio_d);
					this.f_revision.setValue(this.registro.f_revision_d);
					this.evidencia.setValue(this.registro.evidencia);
					this.u_cancela.setValue(this.registro.u_cancela);
					this.f_cancela.setValue(this.registro.f_cancela);
					this.motivo_cancela.setValue(this.registro.motivo_cancela);
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

	get autoriza_desc() {
		return this.forma.get('autoriza_desc');
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

	get puesto() {
		return this.forma.get('puesto');
	}

	get fecha() {
		return this.forma.get('fecha');
	}

	get f_revision() {
		return this.forma.get('f_revision');
	}

	get evidencia() {
		return this.forma.get('evidencia');
	}

	get u_cancela() {
		return this.forma.get('u_cancela');
	}

	get f_cancela() {
		return this.forma.get('f_cancela');
	}

	get motivo_cancela() {
		return this.forma.get('motivo_cancela');
	}

	getPuestos(idProc) {
		this._puestos.getPuestosAreaProc(idProc).subscribe(
			(data: any) => {
				this.puestos = data.puestos;
			});
	}

	async guardar() {
		if (this.registro.autoriza === 7) {
			swal('ERROR', 'La Línea de Acción ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: '¿Está seguro que desea guardar los cambios en la linea de acción "'
					+ this.registro.linea_desc + '" para el proceso "' + this.registro.proceso_desc + '"?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				this.subscription = this._direccion.editarLineaAccionDE(this.forma.value)
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
