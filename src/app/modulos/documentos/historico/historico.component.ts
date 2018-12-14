import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { AccesoService, ProcesosService, CatalogosService } from '../../../services/services.index';
import { HttpClient } from '@angular/common/http';
import { HeadersGET } from '../../../config/config';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-historico',
	templateUrl: './historico.component.html'
})

export class HistoricoComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	@ViewChild ('filtro') filtro: ElementRef;
	@ViewChild ('periodo') cmb_periodo: ElementRef;

	cargando = false;
	procesos: any[] = [];
	procesosMostrar: any[] = [];

	bandera = false;
	periodos: any[] = [];
	periodo: string;

	constructor(private _acceso: AccesoService,
				private _proceso: ProcesosService,
				private _catalogos: CatalogosService,
				private http: HttpClient) { }

	ngOnInit() {
		this.cargando = true;
		this.getPeriodos();
		this.getProcesos();
		this.periodo = '';
		this.bandera = true;
		this.cargando = false;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getProcesos() {
		this.subscription = this._proceso.getProcesosUsuario('historico')
			.subscribe(
				(data: any) => {
					this.procesos = data.procesos;
					this.procesosMostrar = data.procesos; // Para el filtro
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getPeriodos() {
		this.subscription = this._catalogos.getCatalogoService('PER')
			.subscribe(
				(data: any) => {
					this.periodos = data.catalogo; // .filter(item => item.estatus === 'CERRADO')
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
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

	cambio() {
		this.periodo = this.cmb_periodo.nativeElement.value;
		if (this.periodo !== '') {
			this.bandera = false;
		}
	}

	visualizar(proceso, reporte) {
		if (this.periodo === '') {
			swal('ERROR', 'Debe seleccionar el periodo histórico a consultar', 'error');
		} else {
			let ruta = 'http://sgc.ujed.mx/SGCRPT/' + this.periodo + '/' + proceso + '/';

			switch (reporte) {
				case 'foda': {
					ruta = ruta + 'FODA_' + proceso + '.pdf';
					break;
				}
				case 'direccion': {
					ruta = ruta + 'Direccion_' + proceso + '.pdf';
					break;
				}
				case 'riesgosg': {
					ruta = ruta + 'Riesgos_' + proceso + '.pdf';
					break;
				}
				case 'matriz': {
					ruta = ruta + 'Matriz_' + proceso + '.pdf';
					break;
				}
				case 'ficha': {
					ruta = ruta + 'FichaProc_' + proceso + '.pdf';
					break;
				}
			}
			try {
				this.http.get(ruta).subscribe(
					(res: any) => {
						window.open(ruta, '_blank');
					},
					error => {
						if (error.status === 200) {
							window.open(ruta, '_blank');
						} else {
							swal('ERROR', 'No existe en el Histórico el archivo deseado', 'error');
						}
					});
			} catch (Exception) {
				console.log(Exception);
			}
		}
	}

}
