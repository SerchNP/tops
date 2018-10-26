import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IndicadoresService, AccesoService, CatalogosService, IdentidadService, ProcesosService } from '../../../services/services.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-indicador-area-formulario',
	templateUrl: './indicador-area-formulario.component.html',
	providers: [CatalogosService]
})
export class IndicadorAreaFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando: boolean;
	accion: string;
	idIndicador: number;
	titulo: string;

	seleccionado = '';
	items: any [] = [];

	procesos: any[] = [];
	formulas: any[] = [];
	frecuencias: any[] = [];
	resultados: any[] = [];
	objetivos: any[] = [];

	forma: FormGroup;
	cancelar: any[] = ['/indicadores', 'indicador_area'];

	constructor(private activatedRoute: ActivatedRoute,
				private router: Router,
				private _acceso: AccesoService,
				private _indicadores: IndicadoresService,
				private _procesos: ProcesosService,
				private _catalogos: CatalogosService,
				private _identidad: IdentidadService
				) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idIndicador = params['id'];
		});
		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';		break;
			case 'U':	pre = 'Actualización';	break;
			case 'V':	pre = 'Consulta';		break;
		}

		this.titulo = pre + ' de Indicadores';

		if (this.idIndicador !== 0) {
			this.cargarIndicador(this.idIndicador);
		}
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'proceso' : new FormControl(),
			'proceso_desc': new FormControl('', Validators.required),
			'tipo' : new FormControl(null, Validators.required),
			'indicador' : new FormControl(),
			'indicador_desc' : new FormControl('', Validators.required),
			'objetivo' : new FormControl('', Validators.required),
			'meta': new FormControl('', Validators.required),
			'frecuencia' : new FormControl('', Validators.required),
			'formula': new FormControl('', Validators.required),
			't_formula' : new FormControl('', Validators.required),
			't_resultado' : new FormControl('', Validators.required)
		});
		this.cargando = true;
		this.getCatalogos();
		this.getProcesos();
		this.cargando = false;
	}

	getCatalogos() {
	}

	getObjetivos(sistema: number) {
		this.cargando = true;
		this.subscription = this._identidad.getIdentidad('V', sistema, 'O')
			.subscribe(
				(data: any) => {
					this.objetivos = data.identidad;
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

	asignarproceso() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.forma.get('proceso').setValue(json.id);
			this.forma.get('proceso_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado el proceso', 'error');
		}
	}

	cargarIndicador(id: number) {

	}

	guardar () {

	}

	getProcesos() {
		this.subscription = this._procesos.getProcesosUsuario('indicador_area')
			.subscribe(
				(data: any) => {
					this.procesos = data.procesos;
					this._acceso.guardarStorage(data.token);
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
}
