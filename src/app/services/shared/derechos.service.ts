import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { URL_SGC, AUTH } from '../../config/config';
import { Derechos } from '../../interfaces/derechos.interface';
import { AccesoService } from './acceso.service';
import swal from 'sweetalert2';

@Injectable()
export class DerechosService {

	constructor(public http: HttpClient, public router: Router, private _accesoService: AccesoService) {}

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getDerechosService(menuID: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/derechos/getDerechos.json?token=' + token + '&m=' + menuID;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getDerechosProcesoService(proceso: number) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/derechos/getDerechosProceso.json?token=' + token + '&p=' + proceso;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getDerechos(menuID: string): Derechos {
		const derechos: Derechos = {};
		const tipoUser = this._accesoService.tipoUsuario();

		if ((tipoUser === 'S') || (tipoUser === 'C')) {
			derechos.consultar = true;
			derechos.insertar = true;
			derechos.editar = true;
			derechos.cancelar = true;
			derechos.descargar = true;
			derechos.exportar = true;
		} else {
			this.getDerechosService(menuID)
			.subscribe(
				data => {
					const jsonData = data;
					const derechosJ = jsonData['derechos'];
					derechos.consultar = true; // Siempre tiene opcion de ver
					derechos.insertar = ((derechosJ.insertar === 'S') ? true : false);
					derechos.editar = ((derechosJ.editar === 'S') ? true : false);
					derechos.cancelar = ((derechosJ.cancelar === 'S') ? true : false);
					derechos.descargar = ((derechosJ.descargar === 'S') ? true : false);
					derechos.exportar = ((derechosJ.exportar === 'S') ? true : false);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		}
		return derechos;
	}

	getDerechosProceso(proceso: number): Derechos {
		const derechosProceso: Derechos = {};
		const tipoUser = this._accesoService.tipoUsuario();

		if ((tipoUser === 'S') || (tipoUser === 'C')) {
			derechosProceso.consultar = true; // Siempre tiene opcion de ver
			derechosProceso.insertar = true;
			derechosProceso.editar = true;
			derechosProceso.cancelar = true;
			derechosProceso.autorizar = true;
			derechosProceso.descargar = true;
			derechosProceso.exportar = true;
		} else {
			this.getDerechosProcesoService(proceso)
				.subscribe(
					data => {
						const jsonData = data;
						const derechos = jsonData['derechos_proceso'];
						derechosProceso.consultar = true; // Siempre tiene opcion de ver
						derechosProceso.insertar = ((derechos.insertar === 'S') ? true : false);
						derechosProceso.editar = ((derechos.editar === 'S') ? true : false);
						derechosProceso.cancelar = ((derechos.cancelar === 'S') ? true : false);
						derechosProceso.autorizar = ((derechos.autorizar === 'S') ? true : false);
						derechosProceso.descargar = ((derechos.descargar === 'S') ? true : false);
						derechosProceso.exportar = ((derechos.exportar === 'S') ? true : false);
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._accesoService.logout();
						}
					});
		}
		return derechosProceso;
	}

}
