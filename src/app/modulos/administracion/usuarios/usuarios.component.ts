import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService, AccesoService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


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
	derechos: Derechos = {consultar: true, administrar: true, insertar: true, editar: true, cancelar: true};

	ruta_add =  ['/administracion', 'submenuusu', 'usuarios_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'usuario', 	 header: 'Usuario',					 	visible: true,		cell: (usuario: any) => `${usuario.usuario}`},
		{ columnDef: 'nombre',     	 header: 'Nombre',					 	visible: true,		cell: (usuario: any) => `${usuario.nombre}`},
		{ columnDef: 'paterno',   	 header: 'Apellido Paterno', 			visible: true,		cell: (usuario: any) => `${usuario.paterno}`},
		{ columnDef: 'materno',   	 header: 'Apellido Materno', 			visible: true,		cell: (usuario: any) => `${usuario.materno}`},
		{ columnDef: 'email',   	 header: 'E-mail', 					 	visible: true,		cell: (usuario: any) => `${usuario.email}`},
		{ columnDef: 'area_desc',    header: 'Área',					 	visible: true,		cell: (usuario: any) => `${usuario.area_desc}`},
		{ columnDef: 'puesto_desc',  header: 'Puesto',					 	visible: true,		cell: (usuario: any) => `${usuario.puesto_desc}`},
		{ columnDef: 'tipo_desc',    header: 'Tipo',					 	visible: true,		cell: (usuario: any) => `${usuario.tipo_desc}`},
		{ columnDef: 'estatus_desc', header: 'Situación',					visible: true,		cell: (usuario: any) => `${usuario.estatus_desc}`},
		{ columnDef: 'titulo',   	 header: 'Título',						visible: false,		cell: (usuario: any) => `${usuario.titulo}`},
		{ columnDef: 'email2',   	 header: 'E-mail Adicional 1',			visible: false,		cell: (usuario: any) => `${usuario.email2}`},
		{ columnDef: 'email3',   	 header: 'E-mail Adicional 2',			visible: false,		cell: (usuario: any) => `${usuario.email3}`},
		{ columnDef: 'matriz_resp',  header: 'Matriz de Responsabilidades',	visible: false,		cell: (usuario: any) => `${usuario.matriz_resp}`},
	];

	constructor(public _usuarioService: UsuarioService,
				public _accesoService: AccesoService,
				private router: Router, public dialog: MatDialog) {}

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

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarUsuario(datos.row);
		} else if (datos.accion === 'C') {
			this.cancelarUsuario(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	editarUsuario(usuario: any) {
		if (usuario.estatus === 'B') {
			swal('ERROR', 'No es posible editar, el usuario ya se encuentra bloqueado', 'error');
		} else {
			this.router.navigate(['/administracion', 'submenuusu', 'usuarios_form', 'U', usuario.usuario]);
		}
	}

	async cancelarUsuario(usuario: any) {
		if (usuario.estatus === 'B') {
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

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.usuario,
				subtitle: datos.nombre + ' ' + datos.paterno + ' ' + datos.materno,
				situacion: datos.estatus_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica,
				u_cancela: datos.u_bloquea,
				f_cancela: datos.f_bloquea,
				motivo_cancela: datos.motivo_bloquea
			}
		});
	}

}
