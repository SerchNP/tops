import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccesoService, ProcesosService, CatalogosService } from '../../../services/services.index';
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


	constructor(private activatedRoute: ActivatedRoute,
				private formBuilder: FormBuilder,
				private _acceso: AccesoService,
				private _catalogos: CatalogosService,
				private _proceso: ProcesosService) {
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
			case 'A':	pre = 'Autorización/Rechazo'; break;
		}

		this.titulo = pre + ' de Dirección Estratégica';

		if (this.direccionId !== 0) {
			this.cargarDireccionEst(this.direccionId);
		}
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			autoriza_desc: new FormControl(''),
			proceso : new FormControl('', Validators.required)
		});

		this.cargando = true;
		this.getProcesos();
		this.getCatalogos();
		this.cargando = false;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get proceso() {
		return this.forma.get('proceso');
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

}
