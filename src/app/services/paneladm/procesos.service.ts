import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';
import { Proceso } from '../../models/proceso.model';
import { AreaProceso } from '../../interfaces/procesos.interface';


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
		const url = URL_SGC + '/paneladm/procesos/getProcesos.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getProcesoById(proceso: number) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/procesos/getProcesoById.json?id=' + proceso + '&token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAreasAsignadas(proceso: number) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/procesos/getAreasAsignadas.json?id=' + proceso + '&token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getProcesosTree() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/procesos/getProcesosTree.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaProceso(proceso: Proceso) {
		if (proceso.proceso === null) {
			proceso.proceso = 0;
		}
		if (proceso.predecesor === null) {
			proceso.predecesor = 0;
		}
		if (proceso.predecesor_desc === null) {
			proceso.predecesor_desc = '';
		}

		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/procesos/insertaProceso.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(proceso);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificaProceso(proceso: Proceso) {
		if (proceso.predecesor === null) {
			proceso.predecesor = 0;
		}
		if (proceso.predecesor_desc === null) {
			proceso.predecesor_desc = '';
		}
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/procesos/modificaProceso.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(proceso);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelaProceso(proceso: number, motivo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/procesos/cancelaProceso.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(JSON.parse('{"proceso": ' + proceso + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	asignaAreaProceso(areaProceso: AreaProceso) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/procesos/asignaAreaProceso.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(areaProceso);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
