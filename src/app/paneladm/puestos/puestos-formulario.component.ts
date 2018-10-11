import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AccesoService, PuestosService } from '../../services/services.index';
import { Puestos } from '../../interfaces/puestos.interface';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-puestos-formulario',
	templateUrl: './puestos-formulario.component.html'
})

export class PuestosFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	idPuesto: number;
	titulo: string;
	puesto: Puestos;
	formaPuestos: FormGroup;
	cancelar: any[] = ['/paneladm', 'puestos'];

	select_invalid: string;
	seleccionado = '';
	items: any [] = [];

	constructor(private activatesRoute: ActivatedRoute, private router: Router,
			private _accesoService: AccesoService, private _puestosService: PuestosService) {

		this.subscription = this.activatesRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idPuesto = params['id'];
		});

		this.titulo = (this.accion === 'I' ? 'Registro de Puestos' : 'Actualización de Puestos');

		if (this.idPuesto > 0) {
			this.cargarPuesto(this.idPuesto);
		}
	}

	ngOnInit() {
		this.formaPuestos = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'puesto' : new FormControl(),
			'puesto_desc': new FormControl('', Validators.required),
			'predecesor' : new FormControl(),
			'predecesor_desc' : new FormControl()
		});
		this.getPuestosTree();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	cargarPuesto(idPuesto: number) {
		let bandera = false;
		this.subscription = this._puestosService.getPuestoById(idPuesto)
			.subscribe(
				(data: any) => {
					this.puesto = data.puesto;
					this.formaPuestos.patchValue(this.puesto);
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

	getPuestosTree() {
		this.subscription = this._puestosService.getPuestosTree().subscribe((data: any) => this.items = data);
	}

	asignarPredecesor() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.formaPuestos.get('predecesor').setValue(json.id);
			this.formaPuestos.get('predecesor_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado el predecesor', 'error');
		}
	}

	borrarPredecesor() {
		this.formaPuestos.get('predecesor').setValue(null);
		this.formaPuestos.get('predecesor_desc').setValue(null);
	}

	guardar() {
		if (this.accion === 'U') {
			this.subscription = this._puestosService.modificarPuesto(this.formaPuestos.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/paneladm', 'puestos']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		} else {
			this.subscription = this._puestosService.insertarPuesto(this.formaPuestos.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/paneladm', 'puestos']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		}
	}

}
