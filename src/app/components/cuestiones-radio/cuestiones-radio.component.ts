import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-cuestiones-radio',
	templateUrl: './cuestiones-radio.component.html'
})

export class CuestionesRadioComponent {

	@Input() forma: FormGroup;
	@Input() listFODA: any[];
	@Input() listFODASel: any[];
	@Input() accion: string;
	@Input() cuestiones_name: string;


	constructor() {
	}

}
