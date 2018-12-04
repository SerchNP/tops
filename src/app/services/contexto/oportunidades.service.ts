import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Accion } from '../../interfaces/accion.interface';

@Injectable()
export class OportunidadesService {

	private RUTA = '/contexto/oportunidades/';

	constructor(private http: HttpClient) {	}

	getOportunidades (menuID: string) {
		const url = URL_SGC + this.RUTA + 'getOportunidades.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getOportunidadById (regID: number) {
		const url = URL_SGC + this.RUTA + 'getOportunidadById.json?token=' + localStorage.getItem('token') + '&opor=' + regID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getOportunidadesByProceso (proceso: number) {
		const url = URL_SGC + this.RUTA + 'getOportunidadesByProceso.json?token=' + localStorage.getItem('token') + '&p=' + proceso;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAvisoOportunidades(menuID: string) {
		const url = URL_SGC + this.RUTA + 'getAvisoOportunidades.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaOportunidad(oportunidad: any) {
		const url = URL_SGC + this.RUTA + 'insertaOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(oportunidad);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editaOportunidad(oportunidad: any, motivo?: string) {
		if (motivo) {
			oportunidad.motivo_modif = motivo.toUpperCase();
		}
		const url = URL_SGC + this.RUTA + 'editaOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(oportunidad);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelaOportunidad(regid: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelaOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"oportunidad": ' + regid + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	getOportunidadesPendientes() {
		const url = URL_SGC + this.RUTA + 'getOportunidadesPendientes.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getOportunidadesRechazadas() {
		const url = URL_SGC + this.RUTA + 'getOportunidadesRechazadas.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	autorizarOportunidad(oportunidades: any[]) {
		const url = URL_SGC + this.RUTA + 'autorizarOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(oportunidades);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	rechazarOportunidad(idOportunidad: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'rechazarOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"oportunidad": ' + idOportunidad + ', "motivo_rechaza": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	reautorizarOportunidad(oportunidades: any[]) {
		const url = URL_SGC + this.RUTA + 'reautorizarOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(oportunidades);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	getAccionesOportunidades (menuID: string) {
		const url = URL_SGC + this.RUTA + 'getAccionesOportunidades.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAccionOportunidadById (accionID: number) {
		const url = URL_SGC + this.RUTA + 'getAccionOportunidadById.json?token=' + localStorage.getItem('token') + '&a=' + accionID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarAccionOportunidad (accion: Accion) {
		const url = URL_SGC + this.RUTA + 'insertarAccionOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(accion);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editarAccionOportunidad (accion: Accion) {
		const url = URL_SGC + this.RUTA + 'editarAccionOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(accion);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarAccionOportunidad(oportunidadID: number, regid: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarAccionOportunidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"oportunidad": ' + oportunidadID + ', "regid": ' + regid + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
