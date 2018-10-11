import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class IndicadoresService {

	TOKEN = 'token=' + localStorage.getItem('token');

	constructor(private http: HttpClient,
				private router: Router) { }

	getIndicadoresArea () {
		const url = URL_SGC + '/indicadores/getIndicadoresArea.json?' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}
}
