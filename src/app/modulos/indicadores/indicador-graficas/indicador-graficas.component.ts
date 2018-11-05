import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogDetalleComponent } from '../../../components/dialog-detalle/dialog-detalle.component';
import { IndicadoresService, AccesoService, DerechosService } from '../../../services/services.index';
import { Derechos } from '../../../interfaces/derechos.interface';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'app-indicador-graficas',
	templateUrl: './indicador-graficas.component.html'
})
export class IndicadorGraficasComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	idIndicador: number;
	indicador: any;
	listado: any[] = [];
	cargando = false;
	titulo: string;
	derechos: Derechos = {administrar: true, insertar: true, editar: true, cancelar: true};
	ruta_add = ['/indicadores', 'indicador_evalua_form', 'I', 0];
	select = false;
	allowMultiSelect = false;

	columns = [
		{ columnDef: 'f_inicial', 		header: 'Fecha inicial',	cell: (medicion: any) => `${medicion.f_inicial}`, 			align: 'center'},
		{ columnDef: 'f_final',   		header: 'Fecha final',		cell: (medicion: any) => `${medicion.f_final}`},
		{ columnDef: 'autoriza_desc',	header: 'Situación',		cell: (medicion: any) => `${medicion.autoriza_desc}`},
		{ columnDef: 'valor',			header: 'Valor',			cell: (medicion: any) => `${medicion.valor}`},
		{ columnDef: 'u_captura',		header: 'Usuario Cancela',	cell: (medicion: any) => `${medicion.u_captura}`, 		visible: false},
		{ columnDef: 'f_captura',		header: 'Fecha Cancela',	cell: (medicion: any) => `${medicion.f_captura}`, 		visible: false}
	];

	constructor(private activatedRoute: ActivatedRoute,
				private _derechos: DerechosService,
				private _indicadores: IndicadoresService,
				private _acceso: AccesoService,
				private router: Router,
				public dialog: MatDialog) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.idIndicador = params['id'];
		});
		if (this.idIndicador !== 0) {
			this.cargarIndicador(this.idIndicador);
		}
	}

	ngOnInit() {
		this.cargando = true;

	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	cargarIndicador(idIndicador: number) {
		this.subscription = this._indicadores.getIndicadorById(idIndicador)
			.subscribe(
				(data: any) => {
					this.indicador = data.indicador;
					this.titulo = data.indicador.indicador_desc;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	detectarAccion(datos: any): void {
		if (datos.accion === 'E') {
			this.editarmedicion(datos.row);
		} else if (datos.accion === 'C') {
			this.borrarmedicion(datos.row);
		} else if (datos.accion === 'V') {
			this.openDialog(datos.row);
		}
	}

	editarmedicion(medicion: any) {
		if (medicion.autoriza === 7) {
			swal('ERROR', 'No es posible modificar la medición, ya se encuentra cancelada', 'error');
		} else {
		}
	}

	async borrarmedicion(medicion: any) {
		if (medicion.autoriza === 7) {
			swal('ERROR', 'La medición ya se encuentra cancelada', 'error');
		} else {
			const {value: respuesta} = await swal({
				title: 'Atención!!!',
				text: 'Está seguro que desea cancelar la medicion?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				const {value: valor} = await swal({
					title: 'Ingrese la medición del indicador',
					input: 'number',
					showCancelButton: true,
					inputValidator: (value) => {
						return !value && 'Necesita ingresar el valor de la medicion';
					}
				});
				if (valor !== undefined) {
				}
			}
		}
	}

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				situacion: datos.autoriza_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica
			}
		});
	}

}
