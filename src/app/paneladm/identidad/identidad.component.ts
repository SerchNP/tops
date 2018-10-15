import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentidadService, AccesoService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DialogDetalleComponent } from '../../components/dialog-detalle/dialog-detalle.component';


@Component({
	selector: 'app-identidad',
	templateUrl: './identidad.component.html'
})

export class IdentidadComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	path = '';
	tipo = '';
	cargando = false;
	listado: any[] = [];
	ruta_add: any[] = [];
	derechos: Derechos = {administrar: true, consultar: true};
	select = false;
	allowMultiSelect = false;
	columns = [
		{columnDef: 'descrip',			header: 'Descripción',  cell: (identidad: any) => `${identidad.descrip}`},
		{columnDef: 'autoriza_desc',	header: 'Situación',	cell: (identidad: any) => `${identidad.autoriza_desc}`},
		{columnDef: 'activo_desc',		header: 'Estatus',		cell: (identidad: any) => `${identidad.activo_desc}`}
	];

	constructor(private activatedRoute: ActivatedRoute, private router: Router,
				public _acceso: AccesoService, public _identidad: IdentidadService,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.url.subscribe(url => {
			this.path = url[0].path;
			this.tipo = this.getTipo(this.path);
			if (this.tipo !== 'E') {
				this.columns.splice(0, 0, {columnDef: 'sistema',		header: 'Id Sistema',	cell: (identidad: any) => `${identidad.numero}`});
				this.columns.splice(1, 0, {columnDef: 'sistema_desc',	header: 'Sistema',		cell: (identidad: any) => `${identidad.numero}`});
				if (this.tipo === 'O') {
					this.columns.splice(2, 0, {columnDef: 'numero',		header: 'Número',		cell: (identidad: any) => `${identidad.numero}`});
				}
			} else {
				this.columns.splice(0, 0, {columnDef: 'numero',			header: 'Número',		cell: (identidad: any) => `${identidad.numero}`});
			}
			if (this.tipo === 'E') {
				this.ruta_add = ['/paneladm', 'ejes_form', this.tipo, 'I', 0];
			} else {
				this.ruta_add = ['/paneladm', 'submenuident', 'identidad_form', this.tipo, 'I', 0];
			}
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._identidad.getIdentidad('C', 0, this.tipo)
			.subscribe(
				(data: any) => {
					this.listado = data.identidad;
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
		this.subscription.unsubscribe();
	}

	getTipo(path: string) {
		let valor = '';
		switch (path) {
			case 'identidad_p' : valor = 'P'; break;
			case 'identidad_a' : valor = 'A'; break;
			case 'identidad_m' : valor = 'M'; break;
			case 'identidad_v' : valor = 'V'; break;
			case 'identidad_n' : valor = 'N'; break;
			case 'identidad_o' : valor = 'O'; break;
			case 'identidad_e' : valor = 'E'; break;
		}
		return valor;
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarIdentidad(datos.row);
		} else if (datos.accion === 'C') {
			this.cancelarIdentidad(datos.row);
		}  else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	editarIdentidad(identidad: any) {
		if (identidad.activo === 'N') {
			swal('ERROR', 'El registro seleccionado no se puede modificar porque está cancelado', 'error');
		} else {
			if (this.tipo === 'E') {
				this.router.navigate(['/paneladm', 'ejes_form', this.tipo, 'U', identidad.clave]);
			} else {
				this.router.navigate(['/paneladm', 'submenuident', 'identidad_form', this.tipo, 'U', identidad.clave]);
			}
		}
	}

	async cancelarIdentidad(identidad: any) {
		if (identidad.activo === 'N') {
			swal('ERROR', 'El registro seleccionado ya se encuentra cancelado', 'error');
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
					title: 'Ingrese el motivo de cancelación del registro seleccionado',
					input: 'text',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el motivo de cancelación';
					}
				});
				if (motivo !== undefined) {
					this.subscription = this._identidad.cancelarIdentidad(identidad.clave, motivo.toUpperCase())
						.subscribe((data: any) => {
							this._acceso.guardarStorage(data.token);
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
		let titulo;
		let subtitulo;
		switch (this.tipo) {
			case 'A': titulo = 'Alcance de ' + datos.sistema_desc; break; /*subtitulo = datos.descrip; */
			case 'M': titulo = 'Misión de ' + datos.sistema_desc; break;
			case 'V': titulo = 'Visión de ' + datos.sistema_desc; break;
			case 'O': titulo = datos.sistema_desc; subtitulo = 'Objetivo ' + datos.numero + ': ' + datos.descrip; break;
			case 'N': titulo = 'Nota de ' + datos.sistema_desc; break;
			case 'P': titulo = 'Política de Calidad de ' + datos.sistema_desc; break;
			case 'E': titulo = 'Eje Estratégico'; subtitulo = datos.numero + '.- ' + datos.descrip; break;
		}
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: titulo,
				subtitle: subtitulo,
				estatus: datos.autoriza_desc,
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
