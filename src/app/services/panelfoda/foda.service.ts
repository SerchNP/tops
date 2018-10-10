import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { FodaC } from '../../models/fodaC.model';
import 'rxjs/add/observable/of';

@Injectable()
export class FodaService {

	TOKEN = 'token=' + localStorage.getItem('token');

	constructor(private http: HttpClient, private router: Router) { }

	getFODAByProceso (proceso: number) {
		const url = URL_SGC + '/foda/getFODAByProceso.json?p=' + proceso + '&' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getFODAByProcesoP (proceso: number) {
		const url = URL_SGC + '/foda/getFODAByProcesoP.json?p=' + proceso + '&' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaFODA(foda: FodaC) {
		const url = URL_SGC + '/foda/insertaFODA.json?' + this.TOKEN;
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"proceso": ' + foda.proceso + ', "foda_desc": "' + foda.foda_desc + '", "cuestion": "' + foda.cuestion + '", "cuestion_desc": "' + foda.cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editaFODA(fodaID: number, fodaDESC: string, cuestion_desc: string) {
		const url = URL_SGC + '/foda/editaFODA.json?' + this.TOKEN;
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"foda": ' + fodaID + ', "foda_desc": "' + fodaDESC + '", "cuestion_desc": "' + cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelaFODA(fodaID: number, motivo_cancela: string, cuestion_desc: string) {
		const url = URL_SGC + '/foda/cancelaFODA.json?' + this.TOKEN;
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"foda": ' + fodaID + ', "motivo_cancela": "' + motivo_cancela + '", "cuestion_desc": "' + cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	autorizarFODA(arregloFODA: any[]) {
		const url = URL_SGC + '/foda/autorizarFODA.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(arregloFODA);
		console.log(body);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}
}
