import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService, AccesoService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-usuarios',
	templateUrl: './usuarios.component.html',
	styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	jsonData: any;
	listado: any[] = [];
	cargando = false;
	llave = 'usuario';
	derechos: Derechos = {consultar: true, insertar: true, editar: true, cancelar: true};

	ruta_add =  ['/paneladm', 'submenuusu', 'usuarios_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'usuario', 	 header: 'Usuario',			 cell: (usuario: any) => `${usuario.usuario}`},
		{ columnDef: 'nombre',     	 header: 'Nombre',			 cell: (usuario: any) => `${usuario.nombre}`},
		{ columnDef: 'paterno',   	 header: 'Apellido Paterno', cell: (usuario: any) => `${usuario.paterno}`},
		{ columnDef: 'materno',   	 header: 'Apellido Materno', cell: (usuario: any) => `${usuario.materno}`},
		{ columnDef: 'email',   	 header: 'E-mail', 			 cell: (usuario: any) => `${usuario.email}`},
		{ columnDef: 'email2',   	 header: 'E-mail Adicional', cell: (usuario: any) => `${usuario.email2}`},
		{ columnDef: 'area_desc',    header: 'Área',			 cell: (usuario: any) => `${usuario.area_desc}`},
		{ columnDef: 'puesto_desc',  header: 'Puesto',			 cell: (usuario: any) => `${usuario.puesto_desc}`},
		{ columnDef: 'tipo_desc',    header: 'Tipo',			 cell: (usuario: any) => `${usuario.tipo_desc}`},
		{ columnDef: 'estatus_desc', header: 'Situación',		 cell: (usuario: any) => `${usuario.estatus_desc}`}
	];

	constructor(public _usuarioService: UsuarioService,
				public _accesoService: AccesoService,
				private router: Router) {}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._usuarioService.getUsuarios('X', 'X')
			.subscribe(
				data => {
					this.jsonData = data;
					this.listado = this.jsonData.usuarios;
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

	detectarAccion(datos: any): void {
		if (datos.accion === 'V') {
			this.consultarUsuario(datos.row);
		} else if (datos.accion === 'E') {
			this.editarUsuario(datos.row);
		} else if (datos.accion === 'C') {
			this.cancelarUsuario(datos.row);
		}
	}

	consultarUsuario(usuario: any) {
		this.router.navigate(['/paneladm', 'submenuusu', 'usuarios_form', 'V', usuario.usuario]);
	}

	editarUsuario(usuario: any) {
		if (usuario.estatus === 'C') {
			swal('ERROR', 'No es posible editar, el usuario ya se encuentra bloqueado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'submenuusu', 'usuarios_form', 'U', usuario.usuario]);
		}
	}

	async cancelarUsuario(usuario: any) {
		if (usuario.estatus === 'C') {
			swal('ERROR', 'El usuario ya se encuentra bloqueado', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el usuario ' + usuario.usuario + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de bloqueo del usuario ' + usuario.usuario,
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de bloqueo';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._usuarioService.cancelarUsuario(usuario.usuario, motivo.toUpperCase())
						.subscribe((data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._accesoService.logout();
							}
						});
				}
			}
		}
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

}
