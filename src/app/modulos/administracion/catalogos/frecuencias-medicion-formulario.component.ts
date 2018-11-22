import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, CatalogosService } from '../../../services/services.index';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-frecuencias-medicion-formulario',
	templateUrl: './frecuencias-medicion-formulario.component.html'
})

export class FrecuenciasMedicionFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	idFM: number;
	titulo: string;
	forma: FormGroup;
	cancelar: any[] = ['/administracion', 'submenucat', 'frecuencias'];

	select_invalid: string;
	seleccionado = '';
	items: any [] = [];

	constructor(private activated: ActivatedRoute, private router: Router,
				private _acceso: AccesoService, private _catalogos: CatalogosService) {

		this.subscription = this.activated.params.subscribe(params => {
			this.accion = params['acc'];
			this.idFM = params['id'];
		});

		this.titulo = (this.accion === 'I' ? 'Registro' : 'Actualización') + ' de Frecuencias de Medición';

		/*if (this.idFM > 0) {
			this.cargarPuesto(this.idPuesto);
		}*/
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'accion' : new FormControl(this.accion),
			'clave' : new FormControl(0),
			'descrip': new FormControl('', Validators.required),
			'tipo_periodo' : new FormControl('', Validators.required)
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	/*cargarPuesto(idPuesto: number) {
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
	}*/

	guardar() {
		this.subscription = this._catalogos.mantCatFrecuencia(this.forma.value)
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
