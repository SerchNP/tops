import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';

@Injectable()
export class PanelfodaService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}
}
