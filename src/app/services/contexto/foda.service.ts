import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { FodaC } from '../../models/fodaC.model';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class FodaService {

	private RUTA = '/contexto/foda/';

	constructor(private http: HttpClient, private router: Router) { }

	getFODAByProceso (proceso: number) {
		const url = URL_SGC + this.RUTA + 'getFODAByProceso.json?p=' + proceso + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getFODAByProcesoPndtes (proceso: number) {
		const url = URL_SGC + this.RUTA + 'getFODAByProcesoPndtes.json?p=' + proceso + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getFODAByProcesoRechazados (proceso: number) {
		const url = URL_SGC + this.RUTA + 'getFODAByProcesoRechazados.json?p=' + proceso + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaFODA(foda: FodaC) {
		const url = URL_SGC + this.RUTA + 'insertaFODA.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"proceso": ' + foda.proceso + ', "foda_desc": "' + foda.foda_desc + '", "cuestion": "' + foda.cuestion + '", "cuestion_desc": "' + foda.cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editaFODA(fodaID: number, fodaDESC: string, cuestion_desc: string) {
		const url = URL_SGC + this.RUTA + 'editaFODA.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"foda": ' + fodaID + ', "foda_desc": "' + fodaDESC + '", "cuestion_desc": "' + cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelaFODA(fodaID: number, motivo_cancela: string, cuestion_desc: string) {
		const url = URL_SGC + this.RUTA + 'cancelaFODA.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"foda": ' + fodaID + ', "motivo_cancela": "' + motivo_cancela + '", "cuestion_desc": "' + cuestion_desc + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	autorizarFODA(arregloFODA: any[]) {
		const url = URL_SGC + this.RUTA + 'autorizarFODA.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(arregloFODA);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	rechazarFODA(proceso: number, foda: number, motivo_rechaza: string) {
		const url = URL_SGC + this.RUTA + 'rechazarFODA.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"proceso" : ' + proceso + ', "foda": ' + foda + ', "motivo_rechaza": "' + motivo_rechaza + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	reautorizarFODA(arregloFODA: any[]) {
		const url = URL_SGC + this.RUTA + 'reautorizarFODA.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(arregloFODA);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	actualizarPrioridadFODA (cuestion: string, arregloFODA: any[]) {
		const url = URL_SGC + this.RUTA + 'actualizarPrioridadFODA.json?token=' + localStorage.getItem('token') + '&c=' + cuestion;
		const headers = HeadersPOST;
		const body = JSON.stringify(arregloFODA);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	getListadoFODA (tipo: string) {
		const url = URL_SGC + this.RUTA + 'getListadoFODA.json?t=' + tipo + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}
}
