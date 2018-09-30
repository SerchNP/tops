import { Component, OnInit, Input } from '@angular/core';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import { Foda } from '../../interfaces/foda.interface';
import swal from 'sweetalert2';
import { FodaC } from '../../models/fodaC.model';

@Component({
	selector: 'app-card-foda',
	templateUrl: './card-foda.component.html',
	styleUrls: ['./card-foda.component.scss']
})
export class CardFodaComponent implements OnInit {
	@Input() listado: FodaC[] = [];
	@Input() cuestion: string;
	@Input() cuestion_desc: string;
	@Input() proceso: number;
	@Input() derechos: Derechosmenu = {};
	@Input() icono: string;
	bandera: boolean;

	constructor() {}

	ngOnInit() {}

	async agregar() {
		const { value: cuestionDesc } = await swal({
			title: 'Ingrese la nueva ' + this.cuestion_desc,
			input: 'text',
			showCancelButton: true,
			inputValidator: value => {
				return !value && 'Debe ingresar la nueva ' + this.cuestion_desc;
			}
		});
		if (cuestionDesc !== undefined) {
			const foda: FodaC = new FodaC();
			foda.cuestion = this.cuestion;
			foda.foda = -1;
			foda.foda_desc = cuestionDesc.toUpperCase();
			this.listado.push(foda);
		}
	}

	async editarPrioridad(datos: Foda, posicion) {
		const { value: cuestionDesc } = await swal({
			title: '¡Atención!',
			text: '¿Está seguro que desea actualizar la prioridad en la sección ' + this.cuestion_desc + '?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (cuestionDesc !== undefined) {
			console.log('actualiza prioridad');
			this.bandera = false;
			/*this._procesosService.cancelaProceso(proceso.proceso, motivo.toUpperCase())
				.subscribe((data: any) => {
				  swal('Atención!!!', data.message, 'success');
				  this.ngOnInit();
				},
				  error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
					  this._accesoService.logout();
					}
				  });*/
		}
	}

	async editar(datos: FodaC, posicion) {
		const { value: cuestionDesc } = await swal({
			title: 'Ingrese los nuevos datos de la ' + this.cuestion_desc,
			input: 'textarea',
			showCancelButton: true,
			inputValue: datos.foda_desc,
			inputValidator: value => {
				return (!value && 'Debe ingresar los nuevos datos de la ' + this.cuestion_desc
				);
			}
		});
		if (cuestionDesc !== undefined) {
			this.listado[posicion]['foda_desc'] = cuestionDesc.toUpperCase();
		}
	}

	async cancelar(datos: FodaC, posicion) {
		if (datos.autoriza === 7) {
			swal('ERROR', 'La ' + this.cuestion_desc + ' ya se encuentra cancelada', 'error'
			);
		} else {
			const { value: cuestionDesc } = await swal({
				title: '¡Atención!',
				text: '¿Está seguro(a) que desea cancelar la ' + datos.foda_desc + '?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (cuestionDesc) {
				const { value: motivo } = await swal({
					title: 'Ingrese el motivo de cancelación de la ' + this.cuestion_desc,
					input: 'text',
					showCancelButton: true,
					inputValidator: value => {
						return (!value && 'Debe ingresar el motivo de cancelación'
						);
					}
				});
				if (motivo !== undefined) {
					/* this._procesosService.cancelaProceso(proceso.proceso, motivo.toUpperCase())
					.subscribe((data: any) => {
					  swal('Atención!!!', data.message, 'success');
					  this.ngOnInit();
					},
					  error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
						  this._accesoService.logout();
						}
					  });*/
				}
			}
		}
	}

	mover(arr: any[], item: any, pos: number, factor: number) {
		arr.splice(pos, 1);
		arr.splice(pos + factor, 0, item);
		if (!this.bandera) {
			this.bandera = true;
		}
	}
}
