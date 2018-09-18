import { Component, OnInit } from '@angular/core';
import { UsuarioService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
	selector: 'app-usuarios',
	templateUrl: './usuarios.component.html',
	styles: []
})
export class UsuariosComponent implements OnInit {

	jsonData: any;
	listadoUsuarios: any[] = [];
	cargando = false;

	constructor(public _usuarioService: UsuarioService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this._usuarioService.getUsuarios()
			.subscribe(
				data => {
					this.jsonData = data;
					this.listadoUsuarios = this.jsonData.usuarios;
					this._accesoService.guardarStorage(this.jsonData.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

}
