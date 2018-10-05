import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Derechos } from '../../interfaces/derechos.interface';
import { Router } from '@angular/router';
import { UsuarioService, AccesoService } from '../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-usuario-proceso',
	templateUrl: './usuario-proceso.component.html'
})

export class UsuarioProcesoComponent implements OnInit {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {insertar: true, editar: true, cancelar: true};
	ruta_add =  ['/paneladm', 'submenuusu', 'userproc_form', 'I'];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'usuario',			header: 'Usuario',		cell: (usuproc: any) => `${usuproc.usuario}` },
		{ columnDef: 'nombre',			header: 'Nombre',		cell: (usuproc: any) => `${usuproc.nombre}` },
		{ columnDef: 'area',			header: 'Id Área',		cell: (usuproc: any) => `${usuproc.area}` },
		{ columnDef: 'area_desc',		header: 'Área',			cell: (usuproc: any) => `${usuproc.area_desc}` },
		{ columnDef: 'proceso',			header: 'Id Proceso',	cell: (usuproc: any) => `${usuproc.proceso}` },
		{ columnDef: 'proceso_desc',	header: 'Proceso',		cell: (usuproc: any) => `${usuproc.proceso_desc}` },
		{ columnDef: 'activo',			header: 'Activo',		cell: (usuproc: any) => `${usuproc.activo}` },
		{ columnDef: 'administra',		header: 'Administra',	cell: (usuproc: any) => `${usuproc.administra}` },
		{ columnDef: 'autoriza',		header: 'Autoriza',		cell: (usuproc: any) => `${usuproc.autoriza}` }// ,
		// { columnDef: 'responsable',		header: 'Responsable',	cell: (usuproc: any) => `${usuproc.responsable}` }
	];

	constructor(private router: Router, private _usuario: UsuarioService, private _acceso: AccesoService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._usuario.getUsuariosProcesos()
			.subscribe(
				(data: any) => {
					this.listado = data.listado;
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	/*
	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarUsuario(datos.row);
		} else if (datos.accion === 'C') {
			this.cancelarUsuario(datos.row);
		}
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
	*/

}
