import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { URL_SGC, AUTH } from '../../config/config';
import { AccesoService } from './acceso.service';

@Injectable()
export class SidebarService {

	constructor(public http: HttpClient, public router: Router, private _accesoService: AccesoService) {}

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getMenu() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/sidebar/getMenu.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

}
