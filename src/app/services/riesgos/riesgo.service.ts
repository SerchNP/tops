import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Riesgo } from '../../interfaces/riesgo.interface';
import { MedicionRiesgo } from '../../interfaces/medicion-riesgo.interface';

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

	getRiesgosProcesoByTipo(tipo_riesgo: string, proceso: number) {
		const url = URL_SGC + this.RUTA + 'getRiesgosProcesoByTipo.json?token=' + localStorage.getItem('token')
			+ '&t=' + tipo_riesgo + '&p=' + proceso;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getRiesgosPendientes(tipo_riesgo: string) {
		const url = URL_SGC + this.RUTA + 'getRiesgosPendientes.json?token=' + localStorage.getItem('token') + '&t=' + tipo_riesgo;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getRiesgosRechazados(tipo_riesgo: string) {
		const url = URL_SGC + this.RUTA + 'getRiesgosRechazados.json?token=' + localStorage.getItem('token') + '&t=' + tipo_riesgo;
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

	insertarRiesgoGestion(riesgo: Riesgo) {
		const url = URL_SGC + this.RUTA + 'insertarRiesgoGestion.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(riesgo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	modificarRiesgoGestion(riesgo: Riesgo, motivo?: string) {
		if (motivo) {
			riesgo.motivo_modif = motivo.toUpperCase();
		}
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

	autorizarRiesgos(riesgos: any[]) {
		const url = URL_SGC + this.RUTA + 'autorizarRiesgos.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(riesgos);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	rechazarRiesgo(idRiesgo: number, tipo_riesgo: string, motivo: string) {
		const url = URL_SGC + this.RUTA + 'rechazarRiesgo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"riesgo": ' + idRiesgo + ', "tipo_riesgo": "' + tipo_riesgo + '", "motivo_rechaza": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	reautorizarRiesgos(arreglo: any[]) {
		const url = URL_SGC + this.RUTA + 'reautorizarRiesgos.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(arreglo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	insertarRiesgoOperativo(riesgo: Riesgo) {
		if (riesgo.riesgo === null) {
			delete riesgo['riesgo'];
		}
		const url = URL_SGC + this.RUTA + 'insertaRiesgoOperativo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(riesgo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editarRiesgoOperativo(riesgo: Riesgo, motivo?: string) {
		if (motivo) {
			riesgo.motivo_modif = motivo.toUpperCase();
		}
		const url = URL_SGC + this.RUTA + 'editaRiesgoOperativo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(riesgo);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	getMatrizRiesgos (menuID: string) {
		const url = URL_SGC + this.RUTA + 'getMatrizRiesgos.json?token=' + localStorage.getItem('token') + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getMedicionesByRiesgoId (riesgoID: number, menuID: string) {
		const url = URL_SGC + this.RUTA + 'getMedicionesByRiesgoId.json?token=' + localStorage.getItem('token')
			+ '&r=' + riesgoID + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getAccionesByRiesgoId (riesgoID: number, menuID: string) {
		const url = URL_SGC + this.RUTA + 'getAccionesByRiesgoId.json?token=' + localStorage.getItem('token')
			+ '&r=' + riesgoID + '&m=' + menuID;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarMedicionRiesgo (medicion: MedicionRiesgo) {
		const url = URL_SGC + this.RUTA + 'insertarMedicionRiesgo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(medicion);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarMedicionRiesgo(riesgoID: number, regid: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarMedicionRiesgo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"riesgo": ' + riesgoID + ', "regid": ' + regid + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	insertarAccionRiesgo (accion: any) {
		const url = URL_SGC + this.RUTA + 'insertarAccionRiesgo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(accion);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarAccionRiesgo(riesgoID: number, regid: number, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarAccionRiesgo.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"riesgo": ' + riesgoID + ', "regid": ' + regid + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}
}
