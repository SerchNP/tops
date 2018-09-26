import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';

@Injectable()
export class FodaService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getFODA (tipo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/getFODA.json?token=' + token + '&t=' + tipo;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getProcesosFODA() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/getProcesosFODA.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getTipoFODA() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/getTipoFODA.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}
}
