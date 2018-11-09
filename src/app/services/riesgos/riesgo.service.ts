import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { RiesgoGestion } from '../../interfaces/riesgo.interface';

@Injectable()
export class RiesgoService {

	private RUTA = '/riesgos/';

	constructor(private http: HttpClient,
				private router: Router) { }

	getRiesgos(tipo_riesgo: string, menuID: string) {
		const url = URL_SGC + this.RUTA + 'getRiesgos.json?token=' + localStorage.getItem('token') + '&t=' + tipo_riesgo + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAvisoRiesgos(tipo_riesgo: string, menuID: string) {
		const url = URL_SGC + this.RUTA + 'getAvisoRiesgos.json?token=' + localStorage.getItem('token') + '&t=' + tipo_riesgo + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getRiesgoById(riesgoID: number, tipo_riesgo: string) {
		const url = URL_SGC + this.RUTA + 'getRiesgoById.json?id=' + riesgoID + '&t=' + tipo_riesgo + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarRiesgoGestion(riesgo: RiesgoGestion) {
		const url = URL_SGC + this.RUTA + 'insertarRiesgoGestion.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(riesgo);
		console.log(body);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarRiesgoGestion(riesgo: RiesgoGestion) {
		const url = URL_SGC + this.RUTA + 'modificarRiesgoGestion.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(riesgo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarRiesgo(riesgoID: number, tipo_riesgo: string, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarRiesgo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"riesgo": ' + riesgoID + ', "tipo_riesgo": "' + tipo_riesgo + '", "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	autorizaRiesgoGestion(riesgo: RiesgoGestion) {
		const url = URL_SGC + this.RUTA + 'autorizaRiesgoGestion.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(riesgo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	rechazaRiesgoGestion(idRiesgo: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'rechazaRiesgoGestion.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"riesgo": ' + idRiesgo + ', "tipo_riesgo": "G", "motivo_rechaza": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}
}
