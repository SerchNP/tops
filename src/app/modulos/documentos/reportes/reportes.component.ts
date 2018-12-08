import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ArchivosService, AccesoService, ProcesosService, HomeService } from '../../../services/services.index';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-reportes',
	templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	@ViewChild ('filtro') filtro: ElementRef;

	tipoUser: string;
	procesos: any[] = [];
	procesosMostrar: any[] = [];
	cargando = false;

	constructor(private _archivos: ArchivosService,
				private _acceso: AccesoService,
				private _proceso: ProcesosService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._proceso.getProcesosUsuario('reportes')
			.subscribe(
				(data: any) => {
					this.procesos = data.procesos;
					this.procesosMostrar = data.procesos; // Para el filtro
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
			for (const proc of this.procesos) {
				const procDesc = proc.proceso_desc.toLowerCase();
				if (procDesc.indexOf(filtro) >= 0) {
					this.procesosMostrar.push(proc);
				}
			}
		}
	}

	visualizar(proceso, reporte) {
		if (reporte === 'foda') {
			this._archivos.verFODA(proceso)
				.subscribe(res => {
					const fileURL = URL.createObjectURL(res);
					window.open(fileURL, '_blank');
				});
		} else if (reporte === 'direccion') {
			this._archivos.verDireccionEstrategica(proceso)
				.subscribe(res => {
					const fileURL = URL.createObjectURL(res);
					window.open(fileURL, '_blank');
				});
			} else if (reporte === 'riesgosg') {
				this._archivos.verRiesgos(proceso)
					.subscribe(res => {
						const fileURL = URL.createObjectURL(res);
						window.open(fileURL, '_blank');
					});
			}
	}
}
