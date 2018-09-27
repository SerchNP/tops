import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';


@Injectable()
export class IdentidadService {

	constructor(public http: HttpClient) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getIdentidad(sistema: number, tipo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/identidad/getIdentidad.json?s=' + sistema + '&t=' + tipo + '&token=' + token;
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			return resp.identidad;
		});
	}

}
