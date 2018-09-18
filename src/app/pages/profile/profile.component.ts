import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {

	formaProfile: FormGroup;

	constructor() { }

	ngOnInit() {
		this.formaProfile = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'usuario' : new FormControl(),
			'titulo': new FormControl(),
			'nombre' : new FormControl(),
			'paterno' : new FormControl(),
			'materno' : new FormControl(),
			'email' : new FormControl(),
			'email2' : new FormControl(),
			'email3' : new FormControl(),
			'area': new FormControl(),
			'puesto': new FormControl()/*,
			'ent_data' : new FormControl('', Validators.required),
			'estatus' : new FormControl('', Validators.required)*/
		});
	}

}
