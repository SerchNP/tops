import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Derechos } from '../../interfaces/derechos.interface';
import { Router } from '@angular/router';
import { UsuarioService, AccesoService } from '../../services/services.index';
import swal from 'sweetalert2';
import { DialogDetalleComponent } from '../../components/dialog-detalle/dialog-detalle.component';
import { MatDialog } from '@angular/material';
import { DerechosService } from '../../services/shared/derechos.service';

@Component({
	selector: 'app-usuario-proceso',
	templateUrl: './usuario-proceso.component.html'
})

export class UsuarioProcesoComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	listado: any[] = [];
	cargando = false;
	derechos: Derechos = {consultar: true, administrar: true, insertar: true, editar: false, cancelar: true};
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
		{ columnDef: 'menu_desc',		header: 'Opción',		cell: (usuproc: any) => `${usuproc.menu_desc}` },
		{ columnDef: 'activo',			header: 'Activo',		cell: (usuproc: any) => `${usuproc.activo}` },
		{ columnDef: 'administra',		header: 'Administra',	cell: (usuproc: any) => `${usuproc.administra}` },
		{ columnDef: 'autoriza',		header: 'Autoriza',		cell: (usuproc: any) => `${usuproc.autoriza}` }
	];

	constructor(private router: Router,
				private _derechos: DerechosService,
				private _acceso: AccesoService,
				public dialog: MatDialog) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._derechos.getUsuariosMenuProcesos()
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

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarUsuarioMenuProceso(datos.row);
		} else if (datos.accion === 'C') {
			this.cancelarUsuarioMenuProceso(datos.row);
		}  else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	editarUsuarioMenuProceso(registro: any) {
		if (registro.activo === 'N') {
			swal('ERROR', 'No es posible editar, el registro se encuentra inactivo', 'error');
		} else {
			this.router.navigate(['/paneladm', 'submenuusu', 'userproc_form', 'U', registro.usuario, registro.proceso]);
		}
	}

	async cancelarUsuarioMenuProceso(registro: any) {
		if (registro.activo === 'N') {
			swal('ERROR', 'No es posible cancelar, el registro ya se encuentra inactivo', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar el registro seleccionado?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: motivo} = await swal({
					title: 'Ingrese el motivo de inactivción del registro seleccionado',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de inactivación';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._derechos.cancelarUsuarioMenuProceso(registro.usuario, registro.menu, registro.proceso, motivo.toUpperCase())
						.subscribe((data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
						},
						error => {
							swal('ERROR', error.error.message, 'error');
							if (error.error.code === 401) {
								this._acceso.logout();
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
				title: datos.area_desc,
				estatus: datos.activa_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica,
				u_cancela: datos.u_cancela,
				f_cancela: datos.f_cancela,
				motivo_cancela: datos.motivo_cancela
			}
		});
	}

}
