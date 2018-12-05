import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Accion } from '../../interfaces/accion.interface';

@Injectable()
export class DireccionService {

	private RUTA = '/contexto/direccion/';

	constructor(private http: HttpClient) { }

	getDireccionEst(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getDireccionEst.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getDireccionEstById(regid: number) {
		const url = URL_SGC + this.RUTA + 'getDireccionEstById.json?token=' + localStorage.getItem('token') + '&r=' + regid;
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

	cancelaDireccionEst(regid: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelaDireccionEst.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"regid": ' + regid + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	getLineasAccionDireccionEst(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getLineasAccionDireccionEst.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getLineaById (accionID: number) {
		const url = URL_SGC + this.RUTA + 'getLineaById.json?token=' + localStorage.getItem('token') + '&l=' + accionID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	cancelarLineaAccionDE(regid: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarLineaAccionDE.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"accion_id": ' + regid + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editarLineaAccionDE (accion: Accion) {
		const url = URL_SGC + this.RUTA + 'editarLineaAccionDE.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(accion);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
