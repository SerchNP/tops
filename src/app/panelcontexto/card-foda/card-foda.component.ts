import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FodaService, AccesoService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import { FodaC } from '../../models/fodaC.model';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { DialogDetalleComponent } from '../../components/dialog-detalle/dialog-detalle.component';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-card-foda',
	templateUrl: './card-foda.component.html',
	styleUrls: ['./card-foda.component.scss']
})
export class CardFodaComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	@Input() listado: FodaC[] = [];
	@Input() cuestion: string;
	@Input() cuestion_desc: string;
	@Input() proceso: number;
	@Input() derechos: Derechos = {};
	@Input() icono: string;

	bandera: boolean;
	jsonData: any;
	cat_autoriza: any [] = [];

	constructor(private _accesoService: AccesoService,
				private _fodaService: FodaService,
				public dialog: MatDialog) {}

	ngOnInit() {
	}

	async agregar() {
		const { value: fodaDESC } = await swal({
			title: 'Ingrese la nueva ' + this.cuestion_desc,
			input: 'textarea',
			showCancelButton: true,
			inputValidator: value => {
				return !value && 'Debe ingresar la nueva ' + this.cuestion_desc;
			}
		});
		if (fodaDESC !== undefined) {
			const foda: FodaC = new FodaC();
			foda.cuestion = this.cuestion;
			foda.cuestion_desc = this.cuestion_desc;
			foda.foda_desc = fodaDESC;
			foda.proceso = this.proceso;
			foda.autoriza = 1;
			foda.autoriza_desc = 'PENDIENTE';

			this.subscription = this._fodaService.insertaFODA(foda)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					foda.foda = data.foda_id;
					this.listado.push(foda);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		}
	}

	async cancelar(foda: FodaC, index) {
		if (foda.autoriza === 7 || foda.autoriza === 6) {
			swal('ERROR', 'La ' + this.cuestion_desc + ' ya se encuentra cancelada', 'error'
			);
		} else if (foda.autoriza === 5 || foda.autoriza === 4) {
			swal('ERROR', 'La ' + this.cuestion_desc + ' ya se encuentra rechazada', 'error'
			);
		} else {
			const { value: respuesta } = await swal({
				title: '¡Atención!',
				text: '¿Está seguro(a) que desea cancelar la ' + this.cuestion_desc + ': ' + foda.foda_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (respuesta) {
				if (foda.autoriza === 1) {
					this.cancelaFoda (foda, 'D', index);
				} else {
					const { value: motivo } = await swal({
						title: 'Ingrese el motivo de cancelación de la ' + this.cuestion_desc + ' "' + foda.foda_desc + '"',
						input: 'textarea',
						showCancelButton: true,
						inputValidator: value => {
							return (!value && 'Debe ingresar el motivo de cancelación'
							);
						}
					});
					if (motivo !== undefined) {
						this.cancelaFoda (foda, 'C', index, motivo.toUpperCase());
					}
				}
			}
		}
	}

	async actualizarPrioridad() {
		const { value: respuesta } = await swal({
			title: '¡Atención!',
			text: '¿Está seguro que desea actualizar la prioridad en la sección ' + this.cuestion_desc + '?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (respuesta !== undefined) {
			const arreglo: any[] = [];
			this.listado.forEach(element => {
				if (element['autoriza'] === 0 || element['autoriza'] === 1 || element['autoriza'] === 2 || element['autoriza'] === 3) {
					arreglo.push(JSON.parse('{"proceso" : ' + element['proceso'] + ', "foda" : ' + element['foda'] + '}'));
				} else {
					console.log('Descartado: ', element['autoriza_desc'], element['foda'], element['foda_desc']);
				}
			});
			this.subscription = this._fodaService.actualizarPrioridadFODA(this.cuestion, arreglo)
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
			this.bandera = false;
		}
	}

	mover(arr: any[], item: any, pos: number, factor: number) {
		arr.splice(pos, 1);
		arr.splice(pos + factor, 0, item);
		if (!this.bandera) {
			this.bandera = true;
		}
	}

	cancelaFoda (foda: FodaC, modo: string, index: number, motivo?: string) {
		this.subscription = this._fodaService.cancelaFODA(foda.foda, motivo, this.cuestion_desc)
			.subscribe((data: any) => {
				swal('Atención!!!', data.message, 'success');
				this.ngOnInit();
				if (modo === 'D') {
					this.listado.splice(index, 1);
				} else {
					foda.autoriza = 6;
					foda.autoriza_desc = 'CANCELACIÓN PENDIENTE';
					foda.motivo_cancela = motivo.toUpperCase();
				}
			},
			error => {
				swal('ERROR', error.error.message, 'error');
				if (error.error.code === 401) {
					this._accesoService.logout();
				}
			});
	}

	openDialog(datos: any): void {
		const dialogRef = this.dialog.open(DialogDetalleComponent, {
			width: '550px',
			data: {
				title: datos.cuestion + datos.orden + '   ' + datos.foda_desc,
				estatus: datos.autoriza_desc,
				u_captura: datos.u_captura,
				f_captura: datos.f_captura,
				u_modifica: datos.u_modifica,
				f_modifica: datos.f_modifica,
				u_cancela: datos.u_cancela,
				f_cancela: datos.f_cancela,
				motivo_cancela: datos.motivo_cancela,
				u_rechaza: datos.u_rechaza,
				f_rechaza: datos.f_rechaza,
				motivo_rechaza: datos.motivo_rechaza
			}
		});
	}

	ngOnDestroy() {
		// Marca UNIDEFINED, suponemos que porque ya dejó de existir el contenerdor principal (Foda-Formulario)
		/* try {
			this.subscription.unsubscribe();
		} catch (Exception) {
			console.log(Exception);
		} */
	}
}
