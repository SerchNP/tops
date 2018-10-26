import { Injectable } from '@angular/core';
import { URL_SGC, HeadersGET } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { AccesoService } from './acceso.service';
import 'rxjs/add/operator/map';
import swal from 'sweetalert2';

@Injectable()
export class CatalogosService {

	constructor(private http: HttpClient,
				private _accesoService: AccesoService) { }

	getCatalogoService (cat: string) {
		const url = URL_SGC + '/catalogos/getCatalogo.json?token=' + localStorage.getItem('token') + '&c=' + cat;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getCatalogo (cat: string): any {
		this.getCatalogoService(cat)
			.subscribe(
				data => {
					const jsonData: any = data;
					const catalogo: any [] = jsonData.catalogo;
					return catalogo;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	getFrecuencias() {
		const cat = 'FRE';
		this.getCatalogoService(cat)
			.subscribe(
				data => {
					const jsonData: any = data;
					const frecuencias: any [] = jsonData.catalogo;
					return frecuencias;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	getFormulas() {
		const cat = 'FOR';
		this.getCatalogoService(cat)
			.subscribe(
				data => {
					const jsonData: any = data;
					const formulas: any [] = jsonData.catalogo;
					return formulas;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	getResultados() {
		const cat = 'RES';
		this.getCatalogoService(cat)
			.subscribe(
				data => {
					const jsonData: any = data;
					const resultados: any [] = jsonData.catalogo;
					return resultados;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
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
}
