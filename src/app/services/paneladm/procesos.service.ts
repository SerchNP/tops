import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Proceso } from '../../models/proceso.model';
import { AreaProceso } from '../../interfaces/procesos.interface';


@Injectable()
export class ProcesosService {

	RUTA = '/paneladm/procesos/';

	constructor(private http: HttpClient) { }


	getProcesos() {
		const url = URL_SGC + this.RUTA + 'getProcesos.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getProcesoById(proceso: number) {
		const url = URL_SGC + this.RUTA + 'getProcesoById.json?id=' + proceso + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getProcesosByUserArea(usuario?: string) {
		let url = '';
		if (usuario !== undefined) {
			url = URL_SGC + this.RUTA + 'getProcesosByUserArea.json?u=' + usuario + '&token=' + localStorage.getItem('token');
		} else {
			url = URL_SGC + this.RUTA + 'getProcesosByUserArea.json?token=' + localStorage.getItem('token');
		}
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAreasAsignadas(proceso: number) {
		const url = URL_SGC + this.RUTA + 'getAreasAsignadas.json?id=' + proceso + '&token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getProcesosTree() {
		const url = URL_SGC + this.RUTA + 'getProcesosTree.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertaProceso(proceso: Proceso) {
		if (proceso.proceso === null) {
			proceso.proceso = 0;
		}
		if (proceso.predecesor === null) {
			proceso.predecesor = 0;
		}
		if (proceso.predecesor_desc === null) {
			proceso.predecesor_desc = '';
		}

		const url = URL_SGC + this.RUTA + 'insertaProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(proceso);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificaProceso(proceso: Proceso) {
		if (proceso.predecesor === null) {
			proceso.predecesor = 0;
		}
		if (proceso.predecesor_desc === null) {
			proceso.predecesor_desc = '';
		}

		const url = URL_SGC + this.RUTA + 'modificaProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(proceso);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelaProceso(proceso: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelaProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"proceso": ' + proceso + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	asignaAreaProceso(areaProceso: AreaProceso) {
		const url = URL_SGC + this.RUTA + 'asignaAreaProceso.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(areaProceso);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelaAreaAsignada(clave: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelaAreaAsignada.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"clave": ' + clave + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
