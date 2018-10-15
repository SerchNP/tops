import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../services/services.index';
import { Objetivos } from '../interfaces/objetivos.interface';
import swal from 'sweetalert2';

@Component({
	selector: 'app-detalle',
	templateUrl: './detalle.component.html'
})

export class DetalleComponent implements OnInit {

	cargando = false;
	idSistema: number;
	sistema: string;
	alcance: string;
	mision: string;
	vision: string;
	objetivos: Objetivos[] = [];
	nota: string;

	constructor(private activatesRoute: ActivatedRoute, private router: Router, private _homeService: HomeService) {
		this.activatesRoute.params.subscribe(params => {
			this.idSistema = params['id'];
		});
	}

	ngOnInit() {
		this.cargando = true;
		this.getSistema();
		this.getAlcance();
		this.getMision();
		this.getVision();
		this.getObjetivos();
		this.getNota();
	}

	getSistema() {
		this._homeService.getSistemaById(this.idSistema)
			.subscribe(
				data => {
					this.sistema = data;
				},
				error => {
					swal('ERROR', 'Error al cargar el Sistema', 'error');
					this.cargando = false;
				});
	}

	getAlcance() {
		this._homeService.getIdentidad(this.idSistema, 'A')
			.subscribe(
				data => {
					this.alcance = data;
				},
				error => {
					swal('ERROR', 'Error al cargar el Alcance', 'error');
					this.cargando = false;
				});
	}

	getMision() {
		this._homeService.getIdentidad(this.idSistema, 'M')
			.subscribe(
				data => {
					this.mision = data;
				},
				error => {
					swal('ERROR', 'Error al cargar la Misión', 'error');
					this.cargando = false;
				});
	}

	getVision() {
		this._homeService.getIdentidad(this.idSistema, 'V')
			.subscribe(
				data => {
					this.vision = data;
				},
				error => {
					swal('ERROR', 'Error al cargar la Visión', 'error');
					this.cargando = false;
				});
	}

	getNota() {
		this._homeService.getIdentidad(1, 'N')
			.subscribe(
				data => {
					this.nota = data;
				},
				error => {
					swal('ERROR', 'Error al cargar la Nota', 'error');
					this.cargando = false;
				});
	}

	getObjetivos() {
		this._homeService.getObjetivos(this.idSistema)
			.subscribe(
				data => {
					this.objetivos = data;
				},
				error => {
					swal('ERROR', 'Error al cargar los Objetivos', 'error');
					this.cargando = false;
				});
	}

}
