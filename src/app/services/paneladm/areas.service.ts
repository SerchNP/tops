import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';

@Injectable()
export class AreasService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getAreas() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/areas/getAreas.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAreasTree() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/areas/getAreasTree.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map((resp: any) => {
			return resp.areas;
		});
	}

}
