import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetodoEvaluacionService, AccesoService } from '../../services/services.index';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-tabla-metodo-evaluacion',
	templateUrl: './tabla-metodo-evaluacion.component.html',
	styleUrls: ['./tabla-metodo-evaluacion.component.scss']
})

export class TablaMetodoEvaluacionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando = false;
	tabla: any[] = [];

	constructor(private _acceso: AccesoService,
				private _mevaluacion: MetodoEvaluacionService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._mevaluacion.getTabla()
			.subscribe(
				(data: any) => {
					this.tabla = data.tabla;
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

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}
