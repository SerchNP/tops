import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../shared/users.service';

@Injectable()
export class LoginGuardGuard implements CanActivate {

	constructor(public _usersService: UsersService, public router: Router) {

	}

	canActivate(): boolean {
		if (this._usersService.estaLogueado()) {
			console.log('Paso el Guard');
			return true;
		} else {
			console.log('Bloqueado por el guard');
			this.router.navigate(['/home']);
			return false;
		}
	}
}
