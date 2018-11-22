import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccesoService, CatalogosService } from '../../../services/services.index';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-tresultados-formulario',
	templateUrl: './tresultados-formulario.component.html'
})

export class TresultadosFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	idFM: number;
	titulo: string;
	forma: FormGroup;
	cancelar: any[] = ['/administracion', 'submenucat', 'tresultados'];

	select_invalid: string;
	seleccionado = '';
	items: any [] = [];

	constructor(private activated: ActivatedRoute, private router: Router,
				private _acceso: AccesoService, private _catalogos: CatalogosService) {

		this.subscription = this.activated.params.subscribe(params => {
			this.accion = params['acc'];
			this.idFM = params['id'];
		});

		this.titulo = (this.accion === 'I' ? 'Registro' : 'Actualización') + ' de Tipos de Resultados';
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'accion' : new FormControl(this.accion),
			'clave' : new FormControl(0),
			'descrip': new FormControl('', Validators.required),
			'simbolo' : new FormControl('', Validators.required)
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	guardar() {
		this.subscription = this._catalogos.mantCatResultados(this.forma.value)
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
