import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { AccesoService } from './acceso.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import swal from 'sweetalert2';

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

	getCatalogoPromesa (cat: string) {
		const promesa = new Promise((resolve, reject) => {
			const url = URL_SGC + this.RUTA + 'getCatalogo.json?token=' + localStorage.getItem('token') + '&c=' + cat;
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

	editaDescFrecuencia(clave: number, descripcion: string, tipoPeriodo: string) {
		const url = URL_SGC + this.RUTA + 'editaDescFrecuencia.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"c": ' + clave + ', "d": "' + descripcion + '", "tp": "' + tipoPeriodo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editaDescripcion(clave: number, descripcion: string) {
		const url = URL_SGC + this.RUTA + 'editaDescripcion.json?token=' + localStorage.getItem('token');
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"c": ' + clave + ', "d": "' + descripcion + '"}'));
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
		this.getCatalogoService(cat)
			.subscribe(
				data => {
					const jsonData: any = data;
					const estados: any [] = jsonData.catalogo;
					return estados;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	getTipoCuestion() {
		const cat = 'CEI';
		return this.getCatalogoPromesa(cat);
	}

	getTipoEstrategia() {
		const cat = 'EST';
		return this.getCatalogoPromesa(cat);
	}
}
