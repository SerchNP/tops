import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';
import { FodaC } from '../../models/fodaC.model';

@Injectable()
export class FodaService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	private getHeadersPOST(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH,
			'Content-Type' : 'application/json'
		});
		return headers;
	}

	getFODA (tipo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/getFODA.json?token=' + token + '&t=' + tipo;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getFODAByProceso (proceso: number) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/getFODAByProceso.json?token=' + token + '&p=' + proceso;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getTipoFODA() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/getTipoFODA.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaFODA(foda: FodaC) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/insertaFODA.json?token=' + token;
		const headers = this.getHeadersPOST();
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"proceso": ' + foda.proceso + ', "foda_desc": "' + foda.foda_desc + '", "cuestion": "' + foda.cuestion + '", "cuestion_desc": "' + foda.cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editaFODA(fodaID: number, fodaDESC: string, cuestion_desc: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/editaFODA.json?token=' + token;
		const headers = this.getHeadersPOST();
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"foda": ' + fodaID + ', "foda_desc": "' + fodaDESC + '", "cuestion_desc": "' + cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelaFODA(fodaID: number, motivo_cancela: string, cuestion_desc: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/foda/cancelaFODA.json?token=' + token;
		const headers = this.getHeadersPOST();
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"foda": ' + fodaID + ', "motivo_cancela": "' + motivo_cancela + '", "cuestion_desc": "' + cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}
}
