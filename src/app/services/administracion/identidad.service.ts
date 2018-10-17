import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SGC, HeadersPOST, HeadersGET } from '../../config/config';
import { Identidad } from '../../interfaces/identidad.interface';
import 'rxjs/add/operator/map';

@Injectable()
export class IdentidadService {

	private RUTA = '/administracion/identidad/';

	constructor(public http: HttpClient) { }

	getIdentidad(consulta: string, sistema: number, tipo: string) {
		// tslint:disable-next-line:max-line-length
		const url = URL_SGC + this.RUTA + 'getIdentidad.json?c=' + consulta + '&s=' + sistema + '&t=' + tipo + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, { headers }).map(resp => resp);
	}

	getIdentidadById(clave: number) {
		const url = URL_SGC + this.RUTA + 'getIdentidadById.json?clave=' + clave + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, { headers }).map(resp => resp);
	}

	insertarIdentidad(identidad: Identidad) {
		if (identidad.clave === null) {
			delete identidad['clave'];
		}
		if (identidad.f_final === null) {
			delete identidad['f_final'];
		}
		const url = URL_SGC + this.RUTA + 'insertarIdentidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(identidad);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarIdentidad(identidad: Identidad) {
		if (identidad.f_final === null) {
			delete identidad['f_final'];
		}
		const url = URL_SGC + this.RUTA + 'modificarIdentidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(identidad);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarIdentidad(identidad: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarIdentidad.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"clave": ' + identidad + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
