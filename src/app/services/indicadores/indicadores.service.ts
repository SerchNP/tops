import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class IndicadoresService {

	private RUTA = '/indicadores/';

	constructor(private http: HttpClient,
				private router: Router) { }

	getIndicadoresUAP(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getIndicadoresUAP.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}
}
