import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { URL_SGC, AUTH } from '../../config/config';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import { AccesoService } from './acceso.service';
import swal from 'sweetalert2';

@Injectable()
export class SidebarService {

	constructor(public http: HttpClient, public router: Router, private _accesoService: AccesoService) {}

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getMenu() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/sidebar/getMenu.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getDerechosMenu(menuID: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/sidebar/getDerechosMenu.json?token=' + token + '&m=' + menuID;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getDerechos(menuID: string): Derechosmenu {
		const derechosMenu: Derechosmenu = {};
		const tipoUser = this._accesoService.tipoUsuario();

		if ((tipoUser === 'N') || (tipoUser === 'A')) {
			this.getDerechosMenu(menuID)
				.subscribe(
					data => {
						const jsonData = data;
						const derechos = jsonData['derechos'];
						derechosMenu.consultar = ((derechos.consultar === 'S') ? true : false);
						derechosMenu.insertar = ((derechos.insertar === 'S') ? true : false);
						derechosMenu.editar = ((derechos.editar === 'S') ? true : false);
						derechosMenu.cancelar = ((derechos.cancelar === 'S') ? true : false);
						derechosMenu.descargar = ((derechos.descargar === 'S') ? true : false);
						derechosMenu.exportar = ((derechos.exportar === 'S') ? true : false);
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._accesoService.logout();
						}
					});
		} else {
			derechosMenu.consultar = true;
			derechosMenu.insertar = true;
			derechosMenu.editar = true;
			derechosMenu.cancelar = true;
			derechosMenu.descargar = true;
			derechosMenu.exportar = true;
		}
		return derechosMenu;
	}

}
