import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccesoService, FichaProcesoService, ProcesosService } from '../../../services/services.index';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-eas-proceso-edicion',
	templateUrl: './eas-proceso-edicion.component.html'
})
export class EASProcesoEdicionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	id: number;
	autoriza: number;
	titulo: string;
	cargando = false;
	forma: FormGroup;
	registro: any;
	clasif: string;
	tipo: string;
	cancelar = ['/contexto', 'submenufichaproc', 'eas_proceso'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private formBuilder: FormBuilder,
				private _acceso: AccesoService,
				private _fichaproc: FichaProcesoService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.id = Number(params['id']);
			this.tipo = params['t'];
		});

		if (this.tipo === 'E') {
			this.clasif = 'Proveedor';
		} else if (this.tipo === 'A') {
			this.clasif = 'Documento';
		} else if (this.tipo === 'S') {
			this.clasif = 'Cliente';
		}
		this.titulo = 'Actualización de E/A/S del proceso';

		this.cargarEAS(this.id);
	}

	ngOnInit() {
		this.cargando = true;
		this.forma = this.formBuilder.group({
			proceso_desc: new FormControl('', Validators.required),
			clave : new FormControl('', Validators.required),
			tipo_desc: new FormControl('', Validators.required),
			consecutivo : new FormControl('', Validators.required),
			descripcion : new FormControl('', Validators.required),
			descripcion_pdc : new FormControl('', Validators.required),
			int_ext : new FormControl('', Validators.required),
			responsable : new FormControl('')
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	cargarEAS (clave: number) {
		this.subscription = this._fichaproc.getEASById(clave)
			.subscribe(
				(data: any) => {
					this.registro = data.easproc;
					this.forma.patchValue(this.registro);
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	get proceso_desc() {
		return this.forma.get('proceso_desc');
	}

	get tipo_desc() {
		return this.forma.get('tipo_desc');
	}

	get clave() {
		return this.forma.get('clave');
	}

	get consecutivo() {
		return this.forma.get('consecutivo');
	}

	get descripcion() {
		return this.forma.get('descripcion');
	}

	get descripcion_pdc() {
		return this.forma.get('descripcion_pdc');
	}

	get int_ext() {
		return this.forma.get('int_ext');
	}

	get responsable() {
		return this.forma.get('responsable');
	}

	async guardar () {
		if (this.registro.autoriza === 7) {
			swal('ERROR', 'La ' + this.registro.tipo_desc + ' ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: '¿Está seguro que desea guardar los cambios en la ' + this.registro.tipo_desc
					+ ' para el proceso "' + this.registro.proceso_desc + '"?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				this.subscription = this._fichaproc.editarEASProceso(this.forma.value)
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
