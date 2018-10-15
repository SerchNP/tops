import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { URL_SGC, HeadersPOST, HeadersGET } from '../../config/config';
import { Derechos } from '../../interfaces/derechos.interface';
import { AccesoService } from './acceso.service';
import swal from 'sweetalert2';

@Injectable()
export class DerechosService {

	private RUTA = '/derechos/';

	constructor(public http: HttpClient,
				public router: Router,
				private _accesoService: AccesoService) {}

	getDerechosMenuProcesoService(menuID: string, procesoID: number) {
		const url = URL_SGC + '/derechos/getDerechosMenuProceso.json?m=' + menuID + '&p=' + procesoID + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getDerechosMenuProceso(menuID: string, procesoID: number): Derechos {
		const derechosMenuProceso: Derechos = {};
		const tipoUser = this._accesoService.tipoUsuario();

		if ((tipoUser === 'S') || (tipoUser === 'C')) {
			derechosMenuProceso.consultar = true; // Siempre tiene opcion de ver
			derechosMenuProceso.administrar = true;
			derechosMenuProceso.autorizar = true;
			derechosMenuProceso.descargar = true;
			derechosMenuProceso.exportar = true;
		} else {
			this.getDerechosMenuProcesoService(menuID, procesoID)
				.subscribe(
					data => {
						const jsonData = data;
						const derechos = jsonData['derechos'];
						derechosMenuProceso.consultar = true; // Siempre tiene opcion de ver
						derechosMenuProceso.administrar = ((derechos.administrar === 'S') ? true : false);
						derechosMenuProceso.autorizar = ((derechos.autorizar === 'S') ? true : false);
						derechosMenuProceso.descargar = ((derechos.descargar === 'S') ? true : false);
						derechosMenuProceso.exportar = ((derechos.exportar === 'S') ? true : false);
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._accesoService.logout();
						}
					});
		}
		return derechosMenuProceso;
	}

	getUsuariosMenuProcesos() {
		const url = URL_SGC + this.RUTA + 'getUsuariosMenuProcesos.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	asignarUsuarioMenuProceso(userprocs: any) {
		const url = URL_SGC + this.RUTA + 'asignaUsuarioMenuProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(userprocs);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarUsuarioMenuProceso(usuario: string, menuID: string, proceso: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelaUsuarioMenuProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"usuario": "' + usuario + '", "menu": "' + menuID + '", "proceso": ' + proceso + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
