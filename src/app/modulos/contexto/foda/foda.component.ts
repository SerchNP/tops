import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AccesoService, ProcesosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { FodaService } from '../../../services/contexto/foda.service';

@Component({
	selector: 'app-foda',
	templateUrl: './foda.component.html'
})
export class FodaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	@ViewChild ('filtro') filtro: ElementRef;

	tipoUser: string;
	jsonData: any;
	procesos: any[] = [];
	procesosMostrar: any[] = [];
	cargando = false;
	derechos: Derechos;

	constructor(private _accesoService: AccesoService,
				private _procesosService: ProcesosService,
				private _fodaService: FodaService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._procesosService.getProcesosUsuario('foda')
			.subscribe(
				data => {
					this.jsonData = data;
					this.procesos = this.jsonData.procesos;
					this.procesosMostrar = this.jsonData.procesos; // Para el filtro
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

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	clearFilter() {
		this.filtro.nativeElement.value = '';
		this.procesosMostrar = this.procesos;
	}

	filtraProcesos(filtro: string) {
		this.procesosMostrar = [];
		if (!filtro) {
			this.procesosMostrar = this.procesos;
		} else {
			filtro = filtro.toLowerCase();
			// tslint:disable-next-line:prefer-const
			for (let proc of this.procesos) {
				const procDesc = proc.proceso_desc.toLowerCase();
				if (procDesc.indexOf(filtro) >= 0) {
					this.procesosMostrar.push(proc);
				}
			}
		}
	}
}