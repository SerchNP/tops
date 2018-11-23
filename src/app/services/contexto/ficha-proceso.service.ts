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

	insertarEASProceso (easproc: any) {
		const url = URL_SGC + this.RUTA + 'insertaEASProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(easproc);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
