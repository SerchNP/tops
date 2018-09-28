import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';
import { Areas } from '../../interfaces/areas.interface';

@Injectable()
export class AreasService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersPOST(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH,
			'Content-Type' : 'application/json'
		});
		return headers;
	}

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getAreas() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/areas/getAreas.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAreasTree() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/areas/getAreasTree.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map((resp: any) => {
			return resp.areas;
		});
	}

	getAreaById(idArea: number) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/areas/getAreaById.json?id=' + idArea + '&token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarArea(area: Areas) {
		if (area.area === null || area.area === 0) {
			delete area['area'];
		}
		if (area.predecesor === null) {
			delete area['predecesor'];
		}
		if (area.predecesor_desc === null) {
			delete area['predecesor_desc'];
		}

		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/areas/insertarArea.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(area);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarArea(area: Areas) {
		if (area.predecesor === null) {
			delete area['predecesor'];
		}
		if (area.predecesor_desc === null) {
			delete area['predecesor_desc'];
		}
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/areas/modificarArea.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(area);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarArea(area: number, motivo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/paneladm/areas/cancelarArea.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(JSON.parse('{"area": ' + area + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
