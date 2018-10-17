import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Puestos } from '../../interfaces/puestos.interface';
import 'rxjs/add/operator/map';

@Injectable()
export class PuestosService {

	RUTA = '/administracion/puestos/';

	constructor(private http: HttpClient) { }

	getPuestos() {
		const url = URL_SGC + this.RUTA + 'getPuestos.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getPuestosTree() {
		const url = URL_SGC + this.RUTA + 'getPuestosTree.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map((resp: any) => resp.puestos);
	}

	getPuestoById(idPuesto: number) {
		const url = URL_SGC + this.RUTA + 'getPuestoById.json?id=' + idPuesto + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarPuesto(puesto: Puestos) {
		if (puesto.puesto === null || puesto.puesto === 0) {
			delete puesto['puesto'];
		}
		if (puesto.predecesor === null) {
			delete puesto['predecesor'];
		}
		if (puesto.predecesor_desc === null) {
			delete puesto['predecesor_desc'];
		}

		const url = URL_SGC + this.RUTA + 'insertarPuesto.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(puesto);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarPuesto(puesto: Puestos) {
		if (puesto.predecesor === null) {
			delete puesto['predecesor'];
		}
		if (puesto.predecesor_desc === null) {
			delete puesto['predecesor_desc'];
		}

		const url = URL_SGC + this.RUTA + 'modificarPuesto.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(puesto);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarPuesto(puesto: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarPuesto.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"puesto": ' + puesto + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
