import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { URL_SGC, HeadersPOST, HeadersGET } from '../../config/config';
import { Identidad } from '../../interfaces/identidad.interface';


@Injectable()
export class IdentidadService {

	private RUTA = '/paneladm/identidad/';
	private TOKEN = 'token=' + localStorage.getItem('token');

	constructor(public http: HttpClient) { }

	getIdentidad(consulta: string, sistema: number, tipo: string) {
		const url = URL_SGC + this.RUTA + 'getIdentidad.json?c=' + consulta + '&s=' + sistema + '&t=' + tipo + '&' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, { headers }).map(resp => resp);
	}

	getIdentidadById(clave: number) {
		const url = URL_SGC + this.RUTA + 'getIdentidadById.json?clave=' + clave + '&' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, { headers }).map(resp => resp);
	}

	insertarIdentidad(identidad: Identidad) {
		/*if (proceso.proceso === null) {
			proceso.proceso = 0;
		}
		if (proceso.predecesor === null) {
			proceso.predecesor = 0;
		}
		if (proceso.predecesor_desc === null) {
			proceso.predecesor_desc = '';
		}*/

		const token = localStorage.getItem('token');
		const url = URL_SGC + this.RUTA + 'insertarIdentidad.json?token=' + token;
		const headers = HeadersPOST;
		const body = JSON.stringify(identidad);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarIdentidad(identidad: Identidad) {
		/*if (proceso.predecesor === null) {
			proceso.predecesor = 0;
		}
		if (proceso.predecesor_desc === null) {
			proceso.predecesor_desc = '';
		}*/
		const token = localStorage.getItem('token');
		const url = URL_SGC + this.RUTA + 'modificarIdentidad.json?token=' + token;
		const headers = HeadersPOST;
		const body = JSON.stringify(identidad);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarIdentidad(identidad: number, motivo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + this.RUTA + 'cancelarIdentidad.json?token=' + token;
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"identidad": ' + identidad + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
