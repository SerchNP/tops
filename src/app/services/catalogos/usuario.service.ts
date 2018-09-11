import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';

@Injectable()
export class UsuarioService {

	constructor() { }

	login(usuario: Usuario) {
		//let url = '/login';
		//return this.http.post(url, usuario);
	}

}
