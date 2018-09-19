import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SGC, AUTH } from '../../config/config';


@Injectable()
export class HomeService {

	constructor(public http: HttpClient, public router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getIdentidad(sistema: number, tipo: string) {
		const url = URL_SGC + '/sgc/getIdentidad.json?s=' + sistema + '&t=' + tipo;
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			return resp.descripcion;
		});
	}

	getSistemas() {
		const url = URL_SGC + '/sgc/getSistemas.json';
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			return resp.sistemas;
		});
	}

	getSistemaById(sistema: number) {
		const url = URL_SGC + '/sgc/getSistemaById.json?s=' + sistema;
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			return resp.sistema;
		});
	}

	getObjetivos(sistema: number) {
		const url = URL_SGC + '/sgc/getObjetivos.json?s=' + sistema;
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			return resp.objetivos;
		});
	}

	getIdentidadFull(sistema: number, tipo: string) {
		const url = URL_SGC + '/sgc/getIdentidadFull.json?s=' + sistema + '&t=' + tipo;
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			return resp.descripcion;
		});
	}
}
