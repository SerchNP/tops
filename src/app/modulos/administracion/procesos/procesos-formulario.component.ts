import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProcesosService, AccesoService, HomeService, PuestosService } from '../../../services/services.index';
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

	procesoSel = '';
	puestoSel = '';
	items: any [] = [];

	proceso: Proceso = new Proceso(null, null, null, null, null, null, null, null, null, null);

	forma: FormGroup;
	cancelar: any[] = ['/administracion', 'submenuproc', 'procesos'];
	sistemas: any[] = [];
	puestos: any[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _procesos: ProcesosService,
				private _puestos: PuestosService,
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
			proceso : new FormControl(),
			proceso_desc: new FormControl('', Validators.required),
			predecesor : new FormControl(),
			predecesor_desc : new FormControl(),
			sistema : new FormControl('', Validators.required),
			objetivo : new FormControl('', Validators.required),
			apartados: new FormControl('', Validators.required),
			responsable: new FormControl('', Validators.required),
			puesto: new FormControl('', Validators.required),
			puesto_desc: new FormControl(),
			ent_data : new FormControl('', Validators.required),
			estatus : new FormControl('', Validators.required)
		});
		this.getProcesosTree();
		this.getPuestosTree();
		this.getSistemas();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get sistema() {
		return this.forma.get('sistema');
	}

	get puesto() {
		return this.forma.get('puesto');
	}

	get ent_data() {
		return this.forma.get('ent_data');
	}

	get estatus() {
		return this.forma.get('estatus');
	}

	cargarProceso(idProceso) {
		let bandera = false;
		this.subscription = this._procesos.getProcesoById(idProceso)
			.subscribe(
				(data: any) => {
					this.proceso = data.proceso;
					this.forma.patchValue(this.proceso);
					const token: string = data.token;
					this._acceso.guardarStorage(token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
					bandera = false;
				});
		return bandera;
	}

	guardar() {
		if (this.accion === 'U') {
			this.subscription = this._procesos.modificaProceso(this.forma.value)
				.subscribe((data: any) => {
					this._acceso.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'submenuproc', 'procesos']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
		} else {
			this.subscription = this._procesos.insertaProceso(this.forma.value)
				.subscribe((data: any) => {
					this._acceso.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'submenuproc', 'procesos']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
		}
	}

	asignarPredecesor() {
		if (this.procesoSel.length > 0) {
			const json = JSON.parse(this.procesoSel);
			this.forma.get('predecesor').setValue(json.id);
			this.forma.get('predecesor_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado el predecesor', 'error');
		}
	}

	borrarPredecesor() {
		this.forma.get('predecesor').setValue(null);
		this.forma.get('predecesor_desc').setValue(null);
	}

	asignarPuesto() {
		if (this.puestoSel.length > 0) {
			const json = JSON.parse(this.puestoSel);
			this.forma.get('puesto').setValue(json.id);
			this.forma.get('puesto_desc').setValue(json.name);
			document.getElementById('closePuesto').click();
		} else {
			swal('Error', 'No se ha seleccionado el puesto', 'error');
		}
	}

	getProcesosTree() {
		this.subscription = this._procesos.getProcesosTree().subscribe((data: any) => {
			this.items = data.procesos;
		});
	}

	getSistemas() {
		this.subscription = this._home.getSistemas().subscribe((data: any) => this.sistemas = data);
	}

	getPuestosTree() {
		this.subscription = this._puestos.getPuestosTree().subscribe((data: any) => {
			this.puestos = data;
		});
	}
}
