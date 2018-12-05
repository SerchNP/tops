import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProcesosService, AccesoService, HomeService } from '../../../services/services.index';
import { Proceso } from '../../../models/proceso.model';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-procesos-formulario',
	templateUrl: './procesos-formulario.component.html'
})

export class ProcesosFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	idProceso: number;
	titulo: string;

	seleccionado = '';
	items: any [] = [];

	proceso: Proceso = new Proceso(null, null, null, null, null, null, null, null, null);

	forma: FormGroup;
	cancelar: any[] = ['/administracion', 'submenuproc', 'procesos'];

	sistemas: any[] = [];

	cargarProceso(idProceso) {
		let bandera = false;
		this.subscription = this._procesosService.getProcesoById(idProceso)
			.subscribe(
				(data: any) => {
					this.proceso = data.proceso;
					this.forma.patchValue(this.proceso);
					const token: string = data.token;
					this._accesoService.guardarStorage(token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
					bandera = false;
				});
		return bandera;
	}

	// tslint:disable-next-line:max-line-length
	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _accesoService: AccesoService,
				private _procesosService: ProcesosService,
				private _home: HomeService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idProceso = Number(params['id']);
		});

		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';		break;
			case 'U':	pre = 'Actualización';	break;
			case 'V':	pre = 'Consulta';		break;
		}

		this.titulo = pre + ' de Procesos';

		if (this.idProceso !== 0) {
			this.cargarProceso(this.idProceso);
		}
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'proceso' : new FormControl(),
			'proceso_desc': new FormControl('', Validators.required),
			'predecesor' : new FormControl(),
			'predecesor_desc' : new FormControl(),
			'sistema' : new FormControl('', Validators.required),
			'objetivo' : new FormControl('', Validators.required),
			'apartados': new FormControl('', Validators.required),
			'responsable': new FormControl('', Validators.required),
			'ent_data' : new FormControl('', Validators.required),
			'estatus' : new FormControl('', Validators.required)
		});
		this.getProcesosTree();
		this.getSistemas();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get sistema() {
		return this.forma.get('sistema');
	}

	get ent_data() {
		return this.forma.get('ent_data');
	}

	get estatus() {
		return this.forma.get('estatus');
	}

	guardar() {
		if (this.accion === 'U') {
			this.subscription = this._procesosService.modificaProceso(this.forma.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'submenuproc', 'procesos']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		} else {
			this.subscription = this._procesosService.insertaProceso(this.forma.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'submenuproc', 'procesos']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		}
	}

	asignarPredecesor() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.forma.get('predecesor').setValue(json.id);
			this.forma.get('predecesor_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado el predecesor', 'error');
		}
	}

	getProcesosTree() {
		this.subscription = this._procesosService.getProcesosTree().subscribe((data: any) => {
			this.items = data.procesos;
		});
	}

	getSistemas() {
		this.subscription = this._home.getSistemas().subscribe((data: any) => this.sistemas = data);
	}

}
