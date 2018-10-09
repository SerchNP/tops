import { Component, OnInit, Input } from '@angular/core';
import { FodaService, AccesoService } from '../../services/services.index';
import { Derechos } from '../../interfaces/derechos.interface';
import { FodaC } from '../../models/fodaC.model';
import swal from 'sweetalert2';


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
	@Input() derechos: Derechos = {};
	@Input() icono: string;

	bandera: boolean;
	jsonData: any;
	cat_autoriza: any [] = [];

	constructor(private _accesoService: AccesoService,
				private _fodaService: FodaService) {}

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

			this._fodaService.insertaFODA(foda)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					foda.foda = data.foda_id;
					this.listado.push(foda);
				},
				error => {
					console.error(error);
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
			const { value: objFoda } = await swal({
				title: '¡Atención!',
				text: '¿Está seguro(a) que desea cancelar la ' + this.cuestion_desc + ': ' + foda.foda_desc + '?',
				type: 'warning',
				input: 'textarea',
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (objFoda) {
				if (foda.autoriza === 1) {
					this.cancelaFoda (foda, 'D', index);
				} else {
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
						this.cancelaFoda (foda, 'C', index, motivo.toUpperCase());
					}
				}
			}
		}
	}

	async editar(foda: FodaC, index) {
		if (foda.autoriza === 7 || foda.autoriza === 6) {
			swal('ERROR', 'La ' + this.cuestion_desc + ' ya se encuentra cancelada', 'error'
			);
		} else if (foda.autoriza === 5 || foda.autoriza === 4) {
			swal('ERROR', 'La ' + this.cuestion_desc + ' ya se encuentra rechazada', 'error'
			);
		} else {
			const { value: fodaDESC } = await swal({
				title: 'Ingrese los nuevos datos de la ' + this.cuestion_desc,
				input: 'textarea',
				showCancelButton: true,
				inputValue: foda.foda_desc,
				inputValidator: value => {
					return (!value && 'Debe ingresar los nuevos datos de la ' + this.cuestion_desc);
				}
			});
			if (fodaDESC !== undefined) {
				this._fodaService.editaFODA(foda.foda, fodaDESC, this.cuestion_desc)
						.subscribe((data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
							this.listado[index]['autoriza'] = 1;
							this.listado[index]['autoriza_desc'] = 'PENDIENTE';
							this.listado[index]['foda_desc'] = fodaDESC;
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

	async editarPrioridad(foda: FodaC, index) {
		const { value: fodaDESC } = await swal({
			title: '¡Atención!',
			text: '¿Está seguro que desea actualizar la prioridad en la sección ' + this.cuestion_desc + '?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (fodaDESC !== undefined) {
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
		this._fodaService.cancelaFODA(foda.foda, motivo, this.cuestion_desc)
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
}
