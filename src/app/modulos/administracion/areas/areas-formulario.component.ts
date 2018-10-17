import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AccesoService, AreasService } from '../../../services/services.index';
import { Areas } from '../../../interfaces/areas.interface';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-areas-formulario',
	templateUrl: './areas-formulario.component.html'
})

export class AreasFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	accion: string;
	titulo: string;
	idArea: number;
	area: Areas;
	formaAreas: FormGroup;
	cancelar: any[] = ['/administracion', 'areas'];
	items: any [] = [];
	seleccionado = '';

	constructor(private activatesRoute: ActivatedRoute, private router: Router,
				private _accesoService: AccesoService, private _areasService: AreasService) {
		this.subscription = this.activatesRoute.params.subscribe(params => {
			this.accion = params['acc'];
			this.idArea = params['id'];
		});

		this.titulo = (this.accion === 'I' ? 'Registro de Áreas' : 'Actualización de Áreas');

		if (this.idArea > 0) {
			this.cargarArea(this.idArea);
		}
	}

	ngOnInit() {
		this.formaAreas = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'area' : new FormControl(),
			'area_desc': new FormControl('', Validators.required),
			'predecesor' : new FormControl(),
			'predecesor_desc' : new FormControl(),
			'tipo' : new FormControl('', Validators.required),
			'ent_data' : new FormControl('', Validators.required)
		});
		this.getAreasTree();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get tipo() {
		return this.formaAreas.get('tipo');
	}

	get ent_data() {
		return this.formaAreas.get('ent_data');
	}

	cargarArea(idArea: number) {
		this.subscription = this._areasService.getAreaById(idArea)
			.subscribe(
				(data: any) => {
					this.area = data.area;
					this.formaAreas.patchValue(this.area);
					this._accesoService.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	getAreasTree() {
		this.subscription = this._areasService.getAreasTree().subscribe((data: any) => this.items = data);
	}

	asignarPredecesor() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.formaAreas.get('predecesor').setValue(json.id);
			this.formaAreas.get('predecesor_desc').setValue(json.name);
			document.getElementById('close').click();
		} else {
			swal('Error', 'No se ha seleccionado el predecesor', 'error');
		}
	}

	borrarPredecesor() {
		this.formaAreas.get('predecesor').setValue(null);
		this.formaAreas.get('predecesor_desc').setValue(null);
	}

	guardar() {
		if (this.accion === 'U') {
			this.subscription = this._areasService.modificarArea(this.formaAreas.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'areas']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		} else {
			this.subscription = this._areasService.insertarArea(this.formaAreas.value)
				.subscribe((data: any) => {
					this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'areas']);
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
