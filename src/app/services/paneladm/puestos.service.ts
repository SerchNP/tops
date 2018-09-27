import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';
import { Puestos } from '../../interfaces/puestos.interface';

@Injectable()
export class PuestosService {

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

	getPuestos() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/puestos/getPuestos.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getPuestosTree() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/puestos/getPuestosTree.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map((resp: any) => resp.puestos);
	}

	getPuestoById(idPuesto: number) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/puestos/getPuestoById.json?id=' + idPuesto + '&token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarPuesto(puesto: Puestos) {
		if (puesto.puesto === null || puesto.puesto === 0) {
			delete puesto['puesto'];
		}
		if (puesto.predecesor === null) {
			delete puesto['predecesor'];
		}
		if (puesto.predecesor_desc === null) {
			delete puesto['predecesor_desc'];
		}

		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/puestos/insertarPuesto.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(puesto);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarPuesto(puesto: Puestos) {
		if (puesto.predecesor === null) {
			delete puesto['predecesor'];
		}
		if (puesto.predecesor_desc === null) {
			delete puesto['predecesor_desc'];
		}
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/puestos/modificarPuesto.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(puesto);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarPuesto(puesto: number, motivo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/puestos/cancelarPuesto.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(JSON.parse('{"puesto": ' + puesto + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
