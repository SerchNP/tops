import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AccesoService, CatalogosService } from '../../../services/services.index';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-periodos-formulario',
	templateUrl: './periodos-formulario.component.html'
})

export class PeriodosFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	titulo: string;
	forma: FormGroup;
	cancelar: any[] = ['/administracion', 'submenucat', 'periodos'];

	constructor(private router: Router,
				private _acceso: AccesoService,
				private _catalogos: CatalogosService) { }

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'anio' : new FormControl('', [Validators.required, Validators.min(2019),
											Validators.max(9999)]),
			'tipo' : new FormControl('TM')
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	guardar() {
		this.subscription = this._catalogos.crearPeriodos(this.forma.value)
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
