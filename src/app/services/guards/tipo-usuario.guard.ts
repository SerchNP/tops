import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccesoService } from '../shared/acceso.service';

@Injectable()
export class TipoUsuarioGuard implements CanActivate {

	constructor(public _accesoService: AccesoService, public router: Router) { }

	canActivate(): boolean {
		if (this._accesoService.tipoUsuario() === 'N' || this._accesoService.tipoUsuario() === 'A') {
			console.log('Bloqueado por el guard TipoUsuario');
			this.router.navigate(['/dashboard']);
			return false;
		} else {
			return true;
		}
	}
}
