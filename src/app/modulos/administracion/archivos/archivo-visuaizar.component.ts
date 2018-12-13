import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-archivo-visuaizar',
	templateUrl: './archivo-visuaizar.component.html'
})

export class ArchivoVisuaizarComponent implements OnInit {

	ruta: any;

	constructor() { }

	ngOnInit() {
		this.ruta = {url : 'http://sistemas.ujed.mx/SGCRPT/TM201804/3005001/FODA_3005001.pdf',
		withCredentials: true};
	}

}
