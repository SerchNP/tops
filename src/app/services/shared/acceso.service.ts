import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import swal from 'sweetalert2';
import { UsuarioLogin } from '../../interfaces/usuarios.interface';
import { URL_SGC, HeadersGET, HeadersPOST } from '../../config/config';


@Injectable()
export class AccesoService {

	constructor(public http: HttpClient, public router: Router) { }

	login(usuario: UsuarioLogin) {
		const body = JSON.stringify(usuario);
		const url = URL_SGC + '/acceso/loginUsuario.json';
		const headers = HeadersPOST;

		return this.http.post(url, body, { headers }).map((resp: any) => {
			localStorage.setItem('token', resp.token);
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

	getUsername() {
		const token = localStorage.getItem('token');
		const payload = JSON.parse(atob(token.split('.')[1]));
		const userInfo = JSON.parse(payload.usuario);
		return userInfo.username;
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
		const url = URL_SGC + '/acceso/renovarToken.json?token=' + localStorage.getItem('token');
		const headers = HeadersGET;

		return this.http.get(url, { headers }).map((resp: any) => {
			localStorage.setItem('token', resp.token);
			return true;
		}).catch(error => {
			this.router.navigate(['/home']);
			swal('Atención', 'ERROR', 'error');
			return Observable.throw(error);
		});
	}
}
