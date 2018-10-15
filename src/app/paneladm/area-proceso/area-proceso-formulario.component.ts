import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProcesosService, AccesoService, AreasService } from '../../services/services.index';
import swal from 'sweetalert2';
import { AreaProceso } from '../../interfaces/procesos.interface';
import { Subscription } from 'rxjs';

@Component ({
	selector: 'app-area-proceso-formulario',
	templateUrl: './area-proceso-formulario.component.html'
})
export class AreaProcesoFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	accion: string;
	clave: number;
	titulo: string;

	select_invalid: string;
	seleccionado = '';
	procesos: any [] = [];
	areas: any [] = [];
	areaProceso: AreaProceso;

	forma: FormGroup;
	cancelar: any[] = ['/paneladm', 'submenuproc', 'area_proceso'];

	constructor(private activatedRoute: ActivatedRoute,
				private _accesoService: AccesoService,
				private _procesosService: ProcesosService,
				private _areasService: AreasService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.clave = params['id'];
			this.titulo = 'Asignación de Áreas a Procesos';
		});
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'proceso' : new FormControl('', Validators.required),
			'proceso_desc': new FormControl(),
			'area' : new FormControl('', Validators.required)
		});
		this.getProcesosTree();
		this.getAreas();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get area() {
		return this.forma.get('area');
	}

	asignarProceso() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.forma.get('proceso').setValue(json.id);
			this.forma.get('proceso_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado el proceso', 'error');
		}
	}

	guardar() {
		this.subscription = this._procesosService.asignaAreaProceso(this.forma.value)
			.subscribe((data: any) => {
				this._accesoService.guardarStorage(data.token);
				swal('Atención!!!', data.message, 'success');
				this.forma.get('area').setValue('');
			},
			error => {
				console.error(error);
				swal('ERROR', error.error.message, 'error');
				if (error.error.code === 401) {
					this._accesoService.logout();
				}
			});
	}

	getAreas() {
		this.subscription = this._areasService.getAreas().subscribe((data: any) => {
			this.areas = data.areas;
		});
	}

	getProcesosTree() {
		this.subscription = this._procesosService.getProcesosTree().subscribe((data: any) => {
			this.procesos = data.procesos;
		});
	}

}
