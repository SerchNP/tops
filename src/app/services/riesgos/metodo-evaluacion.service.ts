import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SGC, HeadersGET } from '../../config/config';
import 'rxjs/add/operator/map';

@Injectable()
export class MetodoEvaluacionService {

	private RUTA = '/metodoEvaluacion/';

	constructor(private http: HttpClient) { }

	getTabla() {
		const url = URL_SGC + this.RUTA + 'getTabla.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getColoresGrafica() {
		const url = URL_SGC + this.RUTA + 'getColoresGrafica.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getDatosGrafica() {
		const url = URL_SGC + this.RUTA + 'getDatosGrafica.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getNivelRiesgo(ocurrencia: number, impacto: number) {
		const promesa = new Promise((resolve, reject) => {
			const url = URL_SGC + this.RUTA + 'getNivelRiesgo.json?token=' + localStorage.getItem('token')
						+ '&oc=' + ocurrencia + '&im=' + impacto;
			const headers = HeadersGET;
			this.http.get(url, {headers}).toPromise()
				.then(
					(res: any) => {
						resolve(res.riesgo);
					},
					msg => {
						reject(msg.error.message);
					}
				);
		});
		return promesa;
	}

}
