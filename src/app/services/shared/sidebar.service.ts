import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { URL_SGC, HeadersGET } from '../../config/config';

@Injectable()
export class SidebarService {

	constructor(public http: HttpClient, public router: Router) {}

	getMenu() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/sidebar/getMenu.json?token=' + token;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

}
