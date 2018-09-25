import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';

@Injectable()
export class PuestosService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getPuestos() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/puestos/getPuestos.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getPuestosTree() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/puestos/getPuestosTree.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map((resp: any) => {
			return resp.puestos;
		});
	}

}
