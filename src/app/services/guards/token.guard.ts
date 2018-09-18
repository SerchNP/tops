import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccesoService } from '../shared/acceso.service';

@Injectable()
export class TokenGuard implements CanActivate {

	constructor (private _accesoService: AccesoService, private router: Router) {}

	canActivate(): Promise<boolean> | boolean {
		console.log('Inicio de verificación del Token');
		const token = localStorage.getItem('token');
		const payload = JSON.parse(atob(token.split('.')[1]));
		const expirado = this.expirado(payload.exp);
		if (expirado) {
			console.log('Bloqueado por el token guard');
			this.router.navigate(['/home']);
			return false;
		} else {
			return true;
		}
	}

	expirado(fechaExp: number) {
		const ahora = new Date().getTime() / 1000;
		if (ahora > fechaExp) {
			console.log('mayor');
			return true;
		} else {
			console.log('menor');
			return false;
		}
	}

}
