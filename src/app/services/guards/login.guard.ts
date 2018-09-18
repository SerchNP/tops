import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccesoService } from '../shared/acceso.service';

@Injectable()
export class LoginGuard implements CanActivate {

	constructor(public _accesoService: AccesoService, public router: Router) { }

	canActivate(): boolean {
		if (this._accesoService.estaLogueado()) {
			// console.log('Paso el Guard');
			return true;
		} else {
			console.log('Bloqueado por el guard');
			this.router.navigate(['/home']);
			return false;
		}
	}
}
