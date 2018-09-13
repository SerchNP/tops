import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { UsuarioLogin } from '../../interfaces/usuarios.interface';
import { URL_SGC, AUTH } from '../../config/config';
import { Router } from '@angular/router';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;



@Injectable()
export class UsersService {

	constructor(public http: HttpClient, public router: Router) { }

	private getHeadersPOST(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH,
			'Content-Type' : 'application/json'
		});
		return headers;
	}

	login(usuario: UsuarioLogin) {
		const body = JSON.stringify(usuario);
		const url = URL_SGC + '/USUARIOS/loginUsuario.json';
		const headers = this.getHeadersPOST();

		return this.http.post(url, body, { headers }).map((resp: any) => {
			this.guardarStorage(resp.token);
			swal('Atención!', resp.message, 'success');
			this.router.navigate(['/dashboard']);
		});
	}

	logout() {
		localStorage.removeItem('token');
		this.router.navigate(['/home']);
	}

	estaLogueado() {
		if (localStorage.getItem('token') === null) {
			return false;
		} else {
			return (localStorage.getItem('token').length > 5);
		}
	}

	nombreUsuario() {
		const token = localStorage.getItem('token');
		const contenido_token = jwt.decode(token);
		const userInfo = JSON.parse(contenido_token.usuario);
		return userInfo.nombre;
	}

	guardarStorage(token: string) {
		localStorage.setItem('token', token);
	}
}
