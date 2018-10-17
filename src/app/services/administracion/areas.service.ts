import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Areas } from '../../interfaces/areas.interface';
import 'rxjs/add/operator/map';

@Injectable()
export class AreasService {

	private RUTA = '/administracion/areas/';

	constructor(private http: HttpClient) { }

	getAreas() {
		const url = URL_SGC + this.RUTA + 'getAreas.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAreasTree() {
		const url = URL_SGC + this.RUTA + 'getAreasTree.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map((resp: any) => {
			return resp.areas;
		});
	}

	getAreaById(idArea: number) {
		const url = URL_SGC + this.RUTA + 'getAreaById.json?id=' + idArea + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
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

		const url = URL_SGC + this.RUTA + 'insertarArea.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
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

		const url = URL_SGC + this.RUTA + 'modificarArea.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(area);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarArea(area: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarArea.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"area": ' + area + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
