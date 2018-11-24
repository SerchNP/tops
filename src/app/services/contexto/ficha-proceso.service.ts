import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class FichaProcesoService {

	private RUTA = '/contexto/fichaproc/';

	constructor(private http: HttpClient) {
	}

	getListadoEAS (menuID: string) {
		const url = URL_SGC + this.RUTA + 'getListadoEAS.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getEASByProceso(proceso: number) {
		const url = URL_SGC + this.RUTA + 'getEASByProceso.json?token=' + localStorage.getItem('token') + '&p=' + proceso;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getEASById (clave: number) {
		const url = URL_SGC + this.RUTA + 'getEASById.json?token=' + localStorage.getItem('token') + '&eas=' + clave;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarEASProceso (easproc: any) {
		const url = URL_SGC + this.RUTA + 'insertarEASProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(easproc);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editarEASProceso (easproc: any) {
		const url = URL_SGC + this.RUTA + 'editarEASProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(easproc);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarEASProceso(clave: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarEASProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"clave": ' + clave + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
