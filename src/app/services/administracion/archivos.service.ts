import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import 'rxjs/add/operator/map';

@Injectable()
export class ArchivosService {
	private RUTA = '/administracion/archivos/';

	constructor(private http: HttpClient) { }

	generarArchivos(periodo: string, procesos: any[]) {
		const arreglo: any[] = [];
		const url = URL_SGC + this.RUTA + 'generar.json?token=' + localStorage.getItem('token');
		procesos.forEach((p) => arreglo.push(p.procoeso));
		const body = JSON.parse('{"periodo" : "' + periodo + '", "procesos" : ' + arreglo + '}');
		const headers = HeadersPOST;
		return this.http.post(url, body, {headers}).map(resp => resp);
	}

	verFODA(proceso: number): any {
		const url = URL_SGC + this.RUTA + 'foda/generar.json?token=' + localStorage.getItem('token') + '&pr=' + proceso;
		const headers = HeadersGET;
		const options = {headers, responseType: 'blob' as 'blob'};
		return this.http.get(url, options).map(
			(res: any) => {
				return new Blob([res], { type: 'application/pdf' });
			});
	}

	verDireccionEstrategica(proceso: number): any {
		const url = URL_SGC + this.RUTA + 'direccion/generar.json?token=' + localStorage.getItem('token') + '&pr=' + proceso;
		const headers = HeadersGET;
		const options = {headers, responseType: 'blob' as 'blob'};
		return this.http.get(url, options).map(
			(res: any) => {
				return new Blob([res], { type: 'application/pdf' });
			});
	}

	verRiesgos(proceso: number): any {
		const url = URL_SGC + this.RUTA + 'riesgos/generar.json?token=' + localStorage.getItem('token') + '&pr=' + proceso;
		const headers = HeadersGET;
		const options = {headers, responseType: 'blob' as 'blob'};
		return this.http.get(url, options).map(
			(res: any) => {
				return new Blob([res], { type: 'application/pdf' });
			});
	}

	verMatrizRiesgos(proceso: number): any {
		const url = URL_SGC + this.RUTA + 'matriz/generar.json?token=' + localStorage.getItem('token') + '&pr=' + proceso;
		const headers = HeadersGET;
		const options = {headers, responseType: 'blob' as 'blob'};
		return this.http.get(url, options).map(
			(res: any) => {
				return new Blob([res], { type: 'application/pdf' });
			});
	}

	verFichaProceso(proceso: number): any {
		const url = URL_SGC + this.RUTA + 'ficha/generar.json?token=' + localStorage.getItem('token') + '&pr=' + proceso;
		const headers = HeadersGET;
		const options = {headers, responseType: 'blob' as 'blob'};
		return this.http.get(url, options).map(
			(res: any) => {
				return new Blob([res], { type: 'application/pdf' });
			});
	}
}
