import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';

@Injectable()
export class UsuarioService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getUsuarios() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/usuarios/getUsuarios.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	login(usuario: Usuario) {
		// let url = '/login';
		// return this.http.post(url, usuario);
	}

}
