import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SGC, AUTH } from '../../config/config';


@Injectable()
export class PrincipalService {

	constructor(public http: HttpClient, public router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getSistemas() {
		const url = URL_SGC + '/sgc/sistemas.json';
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			return resp.sistemas;
		});
	}
}
