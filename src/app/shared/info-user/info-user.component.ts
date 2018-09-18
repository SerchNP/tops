import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../../services/services.index';

@Component({
	selector: 'app-info-user',
	templateUrl: './info-user.component.html',
	styleUrls: ['./info-user.component.css']
})

export class InfoUserComponent implements OnInit {

	nombre: string;

	constructor(public _accesoService: AccesoService) { }

	ngOnInit() {
		this.nombre = this._accesoService.nombreUsuario();
	}

}
