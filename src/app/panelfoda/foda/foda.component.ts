import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccesoService, ProcesosService } from '../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-foda',
	templateUrl: './foda.component.html',
	styles: []
})
export class FodaComponent implements OnInit {

	@ViewChild ('filtro') filtro: ElementRef;

	tipoUser: string;
	jsonData: any;
	procesos: any[] = [];
	cargando = false;
	cat_autoriza: any[] = [];

	constructor(private _accesoService: AccesoService,
				private _procesosService: ProcesosService) {}

	ngOnInit() {
		this.cargando = true;
		this._procesosService.getProcesosByUserArea()
			.subscribe(
				data => {
					this.jsonData = data;
					this.procesos = this.jsonData.procesos;
					this._accesoService.guardarStorage(this.jsonData.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	clearFilter() {
		this.filtro.nativeElement.value = '';
	}
}
