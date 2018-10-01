import { Component, OnInit, Input } from '@angular/core';
import { Derechosmenu } from '../../interfaces/derechosmenu.interface';
import swal from 'sweetalert2';
import { FodaC } from '../../models/fodaC.model';
import { FodaService, AccesoService, CatalogosService } from '../../services/services.index';
import { FodaComponent } from '../foda/foda.component';
import { FodaFormularioComponent } from '../foda/foda-formulario.component';

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
	jsonData: any;

	constructor(private _accesoService: AccesoService,
				private _fodaService: FodaService,
				public _fodaComp: FodaFormularioComponent) {}

	ngOnInit() {
	}

	async agregar() {
		const { value: fodaDESC } = await swal({
			title: 'Ingrese la nueva ' + this.cuestion_desc,
			input: 'text',
			showCancelButton: true,
			inputValidator: value => {
				return !value && 'Debe ingresar la nueva ' + this.cuestion_desc;
			}
		});
		if (fodaDESC !== undefined) {
			const foda: FodaC = new FodaC();
			foda.cuestion = this.cuestion;
			foda.cuestion_desc = this.cuestion_desc;
			foda.foda = -1;
			foda.foda_desc = fodaDESC;
			foda.proceso = this.proceso;
			foda.autoriza = 1;
			foda.autoriza_desc = this._fodaComp.getDescAutoriza(foda.autoriza);

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

	async editarPrioridad(foda: FodaC, posicion) {
		const { value: fodaDESC } = await swal({
			title: '¡Atención!',
			text: '¿Está seguro que desea actualizar la prioridad en la sección ' + this.cuestion_desc + '?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (fodaDESC !== undefined) {
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

	async editar(foda: FodaC, posicion) {
		if (foda.autoriza === 7 || foda.autoriza === 6) {
			swal('ERROR', 'La ' + this.cuestion_desc + ' ya se encuentra cancelada', 'error'
			);
		} else if (foda.autoriza === 5 || foda.autoriza === 4) {
			swal('ERROR', 'La ' + this.cuestion_desc + ' ya se encuentra rechazada', 'error'
			);
		} else {
			const { value: fodaDESC } = await swal({
				title: 'Ingrese los nuevos foda de la ' + this.cuestion_desc,
				input: 'textarea',
				showCancelButton: true,
				inputValue: foda.foda_desc,
				inputValidator: value => {
					return (!value && 'Debe ingresar los nuevos foda de la ' + this.cuestion_desc);
				}
			});
			if (fodaDESC !== undefined) {
				this._fodaService.editaFODA(foda.foda, fodaDESC, this.cuestion_desc)
						.subscribe((data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
							this.listado[posicion]['foda_desc'] = fodaDESC;
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

	async cancelar(foda: FodaC, posicion) {
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
				showCancelButton: true,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#B22222'
			});
			if (objFoda) {
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
					this._fodaService.cancelaFODA(foda.foda, motivo.toUpperCase(), this.cuestion_desc)
						.subscribe((data: any) => {
							swal('Atención!!!', data.message, 'success');
							this.ngOnInit();
							foda.autoriza = 6;
							foda.autoriza_desc = this._fodaComp.getDescAutoriza(foda.autoriza);
							foda.motivo_cancela = motivo.toUpperCase();
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

	mover(arr: any[], item: any, pos: number, factor: number) {
		arr.splice(pos, 1);
		arr.splice(pos + factor, 0, item);
		if (!this.bandera) {
			this.bandera = true;
		}
	}
}
