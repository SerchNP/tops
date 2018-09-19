import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import swal from 'sweetalert2';
import { UsuarioLogin } from '../../interfaces/usuarios.interface';
import { URL_SGC, AUTH } from '../../config/config';


@Injectable()
export class AccesoService {

	constructor(public http: HttpClient, public router: Router) { }

	private getHeadersPOST(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH,
			'Content-Type' : 'application/json'
		});
		return headers;
	}

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	login(usuario: UsuarioLogin) {
		const body = JSON.stringify(usuario);
		const url = URL_SGC + '/acceso/loginUsuario.json';
		const headers = this.getHeadersPOST();

		return this.http.post(url, body, { headers }).map((resp: any) => {
			this.guardarStorage(resp.token);
			const toast = swal.mixin({
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 3000
			});
			toast({
				type: 'success',
				title: resp.message
			});
			// swal('Atención!', resp.message, 'success');
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
		const payload = JSON.parse(atob(token.split('.')[1]));
		const userInfo = JSON.parse(payload.usuario);
		return userInfo.nombre;
	}

	tipoUsuario(): string {
		const token = localStorage.getItem('token');
		const payload = JSON.parse(atob(token.split('.')[1]));
		const userInfo = JSON.parse(payload.usuario);
		return userInfo.tipo;
	}

	guardarStorage(token: string) {
		localStorage.setItem('token', token);
		return;
	}

	renovarToken() {
		const token_act = localStorage.getItem('token');
		const url = URL_SGC + '/acceso/renovarToken.json?token=' + token_act;
		const headers = this.getHeadersGET();

		return this.http.get(url, { headers }).map((resp: any) => {
			const token = resp.token;
			localStorage.setItem('token', token);
			return true;
		}).catch(error => {
			this.router.navigate(['/home']);
			swal('Atención', 'ERROR', 'error');
			return Observable.throw(error);
		});
	}
}
