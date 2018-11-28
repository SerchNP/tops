import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { AccesoService } from './acceso.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class CatalogosService {

	private RUTA = '/catalogos/';

	constructor(private http: HttpClient,
				private _accesoService: AccesoService) { }

	getCatalogoService (cat: string) {
		const url = URL_SGC + this.RUTA + 'getCatalogo.json?token=' + localStorage.getItem('token') + '&c=' + cat;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getCatalogoPromesa (cat: string, param?: number) {
		const promesa = new Promise((resolve, reject) => {
			const url = URL_SGC + this.RUTA + 'getCatalogo.json?token=' + localStorage.getItem('token')
				+ '&c=' + cat + '&p=' + (param !== undefined ? param : 0);
			const headers = HeadersGET;
			this.http.get(url, {headers}).toPromise()
				.then(
					(res: any) => {
						this._accesoService.guardarStorage(res.token);
						resolve(res.catalogo);
					},
					msg => {
						console.log(msg);
						reject(msg.error.message);
					}
				);
		});
		return promesa;
	}

	/*getTipoAccionPromesa (pred: number) {
		const promesa = new Promise((resolve, reject) => {
			const url = URL_SGC + this.RUTA + 'getTipoAccion.json?token=' + localStorage.getItem('token') + '&p=' + pred;
			const headers = HeadersGET;
			this.http.get(url, {headers}).toPromise()
				.then(
					(res: any) => {
						this._accesoService.guardarStorage(res.token);
						resolve(res.catalogo);
					},
					msg => {
						console.log(msg);
						reject(msg.error.message);
					}
				);
		});
		return promesa;
	}*/

	editaDescFrecuencia(clave: number, descripcion: string, tipoPeriodo: string) {
		const url = URL_SGC + this.RUTA + 'mantCatFrecuencia.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		// tslint:disable-next-line:max-line-length
		const body = JSON.stringify(JSON.parse('{"clave": ' + clave + ', "descrip": "' + descripcion + '", "tipo_periodo": "' + tipoPeriodo + '", "accion" : "U"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editaDescripcion(clave: number, descripcion: string) {
		const url = URL_SGC + this.RUTA + 'mantCatFormulas.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"clave": ' + clave + ', "descrip": "' + descripcion + '", "accion" : "U"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	getFrecuencias() {
		const cat = 'FRE';
		return this.getCatalogoPromesa(cat);
	}

	getFormulas() {
		const cat = 'FOR';
		return this.getCatalogoPromesa(cat);
	}

	getResultados() {
		const cat = 'RES';
		return this.getCatalogoPromesa(cat);
	}

	getEstadosRiesgo() {
		const cat = 'ERI';
		return this.getCatalogoPromesa(cat);
	}

	getTipoAccion(pred: number) {
		const cat = 'ARI';
		return this.getCatalogoPromesa(cat, pred);
		// return this.getTipoAccionPromesa(pred);
	}

	getTipoCuestion() {
		const cat = 'CEI';
		return this.getCatalogoPromesa(cat);
	}

	getTipoEstrategia() {
		const cat = 'EST';
		return this.getCatalogoPromesa(cat);
	}

	getImpactoRiesgo() {
		const cat = 'IRI';
		return this.getCatalogoPromesa(cat);
	}

	getOcurrenciaRiesgo(estado: number) {
		const cat = 'ORI';
		return this.getCatalogoPromesa(cat, estado);
	}

	getNivelesRiesgo() {
		const cat = 'NRI';
		return this.getCatalogoPromesa(cat);
	}

	mantCatFrecuencia(frecuencia: any) {
		const url = URL_SGC + this.RUTA + 'mantCatFrecuencia.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(frecuencia);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	mantCatFormulas(formula: any) {
		const url = URL_SGC + this.RUTA + 'mantCatFormulas.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(formula);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	mantCatResultados(resultados: any) {
		const url = URL_SGC + this.RUTA + 'mantCatResultados.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(resultados);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	crearPeriodos(periodo: any) {
		const url = URL_SGC + this.RUTA + 'crearPeriodos.json?anio=' + periodo.anio + '&token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		return this.http.post(url, {}, { headers }).map(resp => resp);
	}

	abrirCerrarPeriodos(periodo: string) {
		const url = URL_SGC + this.RUTA + 'acPeriodos.json?per=' + periodo + '&token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		return this.http.post(url, {}, { headers }).map(resp => resp);
	}
}
