import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentidadService, AccesoService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import swal from 'sweetalert2';


@Component({
	selector: 'app-identidad',
	templateUrl: './identidad.component.html'
})

export class IdentidadComponent implements OnInit, OnDestroy {

	private sub: any;
	path = '';
	tipo = '';
	cargando = false;
	listado: any[] = [];
	ruta_add: any[] = [];
	derechos: Derechos = {insertar: true, editar: true, cancelar: true};
	select = false;
	allowMultiSelect = false;
	columns = [
		{columnDef: 'descrip',			header: 'Descripción',  cell: (identidad: any) => `${identidad.descrip}`},
		{columnDef: 'autoriza_desc',	header: 'Situación',	cell: (identidad: any) => `${identidad.sistema_desc}`},
		{columnDef: 'activo_desc',		header: 'Estatus',		cell: (identidad: any) => `${identidad.sistema_desc}`}
	];

	constructor(private activatedRoute: ActivatedRoute, private router: Router,
				public _acceso: AccesoService, public _identidad: IdentidadService) {
		this.sub = this.activatedRoute.url.subscribe(url => {
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
		this._identidad.getIdentidad('C', 0, this.tipo)
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
		this.sub.unsubscribe();
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

	detectarAccion(accion: any): void {
		if (accion.accion === 'E') {
			this.editarIdentidad(accion.row);
		} else if (accion.accion === 'C') {
			this.cancelarIdentidad(accion.row);
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
					this._identidad.cancelarIdentidad(identidad.clave, motivo.toUpperCase())
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

}
