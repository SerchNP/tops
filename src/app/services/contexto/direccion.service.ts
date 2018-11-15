import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class DireccionService {

	private RUTA = '/contexto/direccion/';

	constructor(private http: HttpClient,
				private router: Router) { }

	getDireccionEst(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getDireccionEst.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getIdFromDireccion(proceso: number, estrategia: number, fodaA: number, fodaB: number) {
		const url = URL_SGC + this.RUTA + 'getIdFromDireccion.json?token=' + localStorage.getItem('token')
					+ '&p=' + proceso + '&e=' + estrategia + '&fa=' + fodaA + '&fb=' + fodaB;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getEjesFromDireccionEstById(direccion: number) {
		const url = URL_SGC + this.RUTA + 'getEjesFromDireccionEstById.json?token=' + localStorage.getItem('token')
					+ '&de=' + direccion;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getLineasFromDireccionEstById(direccion: number) {
		const url = URL_SGC + this.RUTA + 'getLineasFromDireccionEstById.json?token=' + localStorage.getItem('token')
					+ '&de=' + direccion;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaDireccionEst(direccion: any) {
		const url = URL_SGC + this.RUTA + 'insertaDireccionEst.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(direccion);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editaDireccionEst(direccion: any) {
		const url = URL_SGC + this.RUTA + 'editaDireccionEst.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(direccion);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}
}
