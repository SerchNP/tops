import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SGC, HeadersGET } from '../../config/config';
import 'rxjs/add/operator/map';

@Injectable()
export class ArchivosService {
	private RUTA = '/administracion/archivos/';

	constructor(private http: HttpClient) { }

	generarArchivos(periodo: string, proceso?: string) {
		let url = URL_SGC + this.RUTA + 'generar.json?token=' + localStorage.getItem('token') + '&pe=' + periodo;
		if (proceso !== null && proceso !== '') {
			url = url + '&pr=' + proceso;
		}
		console.log(url);
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	/*generarArchivoFODA(periodo: string, proceso?: string) {
		let url = URL_SGC + this.RUTA + 'foda/generar.json?token=' + localStorage.getItem('token') + '&pe=' + periodo;
		if (proceso !== null && proceso !== '') {
			url = url + '&pr=' + proceso;
		}
		console.log(url);
		const headers = HeadersGET;
		return this.http.get(url, {
			responseType: ResponseContentType.Blob}).map(res => {
				return {
					filename: 'filename.pdf',
					data: res.blob()
				};
			})
	}*/

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
