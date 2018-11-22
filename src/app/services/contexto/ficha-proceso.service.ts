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

	getEASProceso (menuID: string) {
		const url = URL_SGC + this.RUTA + 'getEASProceso.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

}
