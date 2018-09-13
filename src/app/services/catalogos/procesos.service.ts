import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';
import { Proceso } from '../../models/proceso.model';


@Injectable()
export class ProcesosService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersPOST(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH,
			'Content-Type' : 'application/json'
		});
		return headers;
	}

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getProcesos() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/procesos/getProcesos.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getProcesoById(proceso: number) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/procesos/getProcesoById.json?id=' + proceso + '&token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map((resp: any) => resp.proceso);
	}

	modificaProceso(proceso: Proceso) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/procesos/cancelaProceso.json?token=' + token;
	}

	cancelaProceso(proceso: number, motivo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/procesos/cancelaProceso.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(JSON.parse('{"proceso": ' + proceso + ', "motivoCancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
