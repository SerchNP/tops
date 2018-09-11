import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../services/services.index';
import { UsuarioLogin } from '../../interfaces/usuarios.interface';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	recuerdame = false;
	user: string;

	jsonData: any;

	usuario: UsuarioLogin = {
		username : '',
		password : ''
	};

	constructor(public _usersService: UsersService ) { }

	ngOnInit() {
		this.user = localStorage.getItem('user') || '';
		this.recuerdame = (localStorage.getItem('user') !== undefined);
	}

	ingresar(forma: NgForm) {
		if (this.recuerdame) {
			localStorage.setItem('user', this.usuario.username||this.user);
		} else {
			localStorage.removeItem('user');
		}
		this.usuario = forma.value;
		this.usuario.password = btoa(this.usuario.password);
		this._usersService.login( this.usuario )
			.subscribe( data => {},
			error => {
				console.error(error);
				swal('ERROR', error.error.message, 'error');
			});
	}

}
