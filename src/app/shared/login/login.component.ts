import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccesoService } from '../../services/services.index';
import { UsuarioLogin } from '../../interfaces/usuarios.interface';
import swal from 'sweetalert2';


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

	constructor(public _accesoService: AccesoService ) { }

	ngOnInit() {
		this.user = localStorage.getItem('user') || '';
		this.recuerdame = (localStorage.getItem('user') !== undefined);
	}

	ingresar(forma: NgForm) {
		this.usuario = forma.value;
		if (this.recuerdame) {
			localStorage.setItem('user', this.usuario.username || this.user);
		} else {
			localStorage.removeItem('user');
		}
		this.usuario.password = btoa(this.usuario.password);
		this._accesoService.login( this.usuario )
			.subscribe( data => {},
			error => {
				console.error(error);
				swal('ERROR', error.error.message, 'error');
			});
	}

}
