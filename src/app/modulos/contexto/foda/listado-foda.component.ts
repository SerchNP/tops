import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { AccesoService, FodaService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { FiltraFodaPipe } from '../../../pipes/filtra-foda.pipe';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-listado-foda',
	templateUrl: './listado-foda.component.html'
})

export class ListadoFodaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	tipo_user: string;
	cargando = false;
	listado: any[] = [];
	listadoFiltrado: any[] = [];
	derechos: Derechos = {consultar: true, administrar: true, insertar: false, editar: true, cancelar: false};
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'proceso', 		header: 'ID Proceso',			cell: (foda: any) => `${foda.proceso}`},
		{ columnDef: 'proceso_desc',   	header: 'Proceso',				cell: (foda: any) => `${foda.proceso_desc}`},
		{ columnDef: 'cuestion_desc', 	header: 'Cuestión',				cell: (foda: any) => `${foda.cuestion_desc}`},
		{ columnDef: 'foda',			header: 'ID',					cell: (foda: any) => `${foda.foda}`},
		{ columnDef: 'orden',			header: 'Núm',					cell: (foda: any) => `${foda.orden}`},
		{ columnDef: 'foda_desc',		header: 'Descripción',			cell: (foda: any) => `${foda.foda_desc}`},
		{ columnDef: 'autoriza_desc',	header: 'Situación',			cell: (foda: any) => `${foda.autoriza_desc}`}
	];


	constructor(private _acceso: AccesoService,
				private _foda: FodaService,
				public dialog: MatDialog) {
		this.tipo_user = _acceso.tipoUsuario();
	}

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._foda.getListadoFODA(this.tipo_user)
		.subscribe(
			(data: any) => {
					this.listado = data.listado;
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
					this.listadoFiltrado = this.listado;
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

	filtrar(filtro?: string) {
		this.listadoFiltrado = new FiltraFodaPipe().transform(this.listado, filtro);
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarFODA(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	async editarFODA(registro: any) {
		const {value: fodaDESC} = await swal({
			title: 'Ingrese el nuevo descriptivo de la ' + registro.cuestion_desc,
			input: 'textarea',
			inputValue: registro.foda_desc,
			showCancelButton: true,
			inputValidator: (value) => {
				return !value && 'Necesita ingresar el descriptivo de la ' + registro.cuestion_desc;
			}
		});
		if (fodaDESC !== undefined) {
			this.subscription = this._foda.editaFODA(registro.foda, fodaDESC, registro.cuestion_desc)
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

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.proceso_desc,
				subtitle: datos.foda_desc,
				situacion: datos.autoriza_desc,
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
