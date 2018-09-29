import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SidebarService, AccesoService, FodaService } from '../../services/services.index';
import swal from 'sweetalert2';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';

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
	derechos: Derechosmenu = {};

	constructor(private _sidebarService: SidebarService,
				private _accesoService: AccesoService,
				private _fodaService: FodaService) {}

	ngOnInit() {
		this.cargando = true;
		this.derechos = this._sidebarService.getDerechos('foda');

		this._fodaService.getProcesosFODA()
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
