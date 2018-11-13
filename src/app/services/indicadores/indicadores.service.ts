import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Indicador } from '../../interfaces/indicador.interface';

@Injectable()
export class IndicadoresService {

	private RUTA = '/indicadores/';

	constructor(private http: HttpClient,
				private router: Router) { }

	getMatrizIndicadores(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getMatrizIndicadores.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAvisoMatrizIndicadores() {
		const url = URL_SGC + this.RUTA + 'getAvisoMatrizIndicadores.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getIndicadoresPendientes() {
		const url = URL_SGC + this.RUTA + 'getIndicadoresPendientes.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getIndicadoresRechazados() {
		const url = URL_SGC + this.RUTA + 'getIndicadoresRechazados.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getMedicionesIndicador(indicadorID: number) {
		const url = URL_SGC + this.RUTA + 'getMedicionesIndicador.json?token=' + localStorage.getItem('token') + '&i=' + indicadorID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getIndicadorById(indicadorID: number) {
		const url = URL_SGC + this.RUTA + 'getIndicadorById.json?id=' + indicadorID + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarIndicador(indicador: any) {
		const url = URL_SGC + this.RUTA + 'insertarIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(indicador);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarIndicador(indicador: Indicador, motivo?: string) {
		if (motivo) {
			indicador.motivo_modif = motivo.toUpperCase();
		}
		const url = URL_SGC + this.RUTA + 'modificarIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(indicador);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarIndicador(indicadorID: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"indicador": ' + indicadorID + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	rechazarIndicador(indicadorID: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'rechazarIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"indicador": ' + indicadorID + ', "motivo_rechaza": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	autorizarIndicadores(arreglo: any[]) {
		const url = URL_SGC + this.RUTA + 'autorizarIndicadores.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(arreglo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	reautorizarIndicadores(arreglo: any[]) {
		const url = URL_SGC + this.RUTA + 'reautorizarIndicadores.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(arreglo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	insertarMedicionIndicador(indicadorID: number, f_inicial: string, f_final: string, medicion: number) {
		const url = URL_SGC + this.RUTA + 'insertarMedicionIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"indicador": ' + indicadorID + ', "f_inicial": "' + f_inicial + '", "f_final": "' + f_final + '", "medicion" : ' + medicion + '}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarMedicionIndicador(indicadorID: number, regid: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarMedicionIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"indicador": ' + indicadorID + ', "regid": ' + regid + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}
}
