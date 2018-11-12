import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class DireccionService {

	private RUTA = '/contexto/direccion/';

	constructor(private http: HttpClient,
				private router: Router) { }

	getDireccionEst(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getDireccionEst.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}
}
