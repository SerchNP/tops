import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccesoService, FodaService } from '../../services/services.index';
import { Foda } from '../../interfaces/foda.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-foda-formulario',
	template: `
		<div class="container" dragula="HANDLES" [(dragulaModel)]="cuestiones">
			<div *ngFor="let item of cuestiones">
			  	<span class="handle">{{ item.foda_desc }}</span>
				<p>{{ item.proceso_desc }}<p>
			</div>
		</div>`
})
export class DebilidadesFormularioComponent implements OnInit {

	private sub: any;
	accion: string;
	idFoda: number;
	titulo: string;
	select_invalid: string;
	seleccionado = '';
	jsonData: any;
	procesos: any [] = [];
	cuestiones: any [] = [];
	cuestion: string;

	foda: Foda;

	forma: FormGroup;

	constructor(private activatesRoute: ActivatedRoute, private router: Router,
				private _accesoService: AccesoService, private _fodaService: FodaService) {
		this.sub = this.activatesRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idFoda = params['id'];
			this.cuestion = params['t'];
		});
		this.titulo = (this.accion === 'I' ? 'Registro de Debilidades' : 'Actualización de Debilidades');
	}

	ngOnInit() {
		this.getFODA();
		this.getProcesos();
	}

	getProcesos() {
		this._fodaService.getProcesosFODA().subscribe((data: any) => {
			this.procesos = data.procesos;
		});
	}

	getFODA() {
		this._fodaService.getFODA(this.cuestion)
			.subscribe(
				data => {
					this.jsonData = data;
					this.cuestiones = this.jsonData.foda;
					this._accesoService.guardarStorage(this.jsonData.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

}
