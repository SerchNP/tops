import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class OportunidadesService {

	private RUTA = '/contexto/oportunidades/';

	constructor(private http: HttpClient) {	}

	getOportunidades (menuID: string) {
		const url = URL_SGC + this.RUTA + 'getOportunidades.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaOportunidad(oportunidad: any) {
		const url = URL_SGC + this.RUTA + 'insertaOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(oportunidad);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}