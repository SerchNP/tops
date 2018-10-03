import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';
import { AccesoService } from './acceso.service';
import swal from 'sweetalert2';

@Injectable()
export class CatalogosService {

	constructor(private http: HttpClient,
				private router: Router,
				private _accesoService: AccesoService) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getCatalogoAutorizaService () {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/getCatalogoAutoriza.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getCatalogoAutoriza (): any {
		this.getCatalogoAutorizaService()
			.subscribe(
				data => {
					const jsonData: any = data;
					const cat_autoriza: any [] = jsonData.cat_autoriza;
					return cat_autoriza;
				},
				error => {
					console.log(error);
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	/*getDescAutoriza: any = (autoriza: number) => {
		const arr = this.cat_autoriza.filter(
			value => value.autoriza === autoriza);
		return arr[0].autoriza_desc;
	}*/

}
