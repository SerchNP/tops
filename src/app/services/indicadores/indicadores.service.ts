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

	getIndicadoresUAP(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getIndicadoresUAP.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getIndicadorById(idIndicador: number) {
		const url = URL_SGC + this.RUTA + 'getIndicadorById.json?id=' + idIndicador + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarIndicador(indicador: any) {
		const url = URL_SGC + this.RUTA + 'insertarIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(indicador);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarIndicador(indicador: Indicador) {
		const url = URL_SGC + this.RUTA + 'modificarIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(indicador);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarIndicador(idIndicador: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarIndicador.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"indicador": ' + idIndicador + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
