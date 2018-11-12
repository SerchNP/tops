import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
	selector: 'app-cuestiones-check',
	templateUrl: './cuestiones-check.component.html'
})

export class CuestionesCheckComponent implements OnInit, OnChanges {

	@Input() forma: FormGroup;
	@Input() listFODA: any[];
	@Input() listFODASel: any[];
	@Input() accion: string;
	@Input() cuestiones_name: string;

	ctrlcuestiones: FormArray;

	constructor(private formBuilder: FormBuilder) {
		console.log(this.listFODA);
	}

	ngOnChanges(changes): void {
		if (changes['listFODA']) {
			this.listFODA.forEach((p) => this.addItem(p, this.listFODASel));
		}
		this.ctrlcuestiones = this.cuestiones;
	}

	ngOnInit() {
	}

	get cuestiones() {
		return this.forma.get(this.cuestiones_name) as FormArray;
	}

	addItem(p, listado): void {
		if (listado.length === 0) {
			this.cuestiones.push(this.createItem(p.proceso, false, p.foda, p.foda_desc, p.cuestion, p.tipo_cuestion_desc, p.orden));
		} else {
			let bandera = false;
			listado.forEach(element => {
				if (p.foda === element.foda) {
					bandera = true;
					return;
				}
			});
			// tslint:disable-next-line:max-line-length
			this.cuestiones.push(this.createItem(p.proceso, bandera, p.foda, p.foda_desc, p.cuestion, p.tipo_cuestion_desc, p.orden));
		}
	}

	createItem(proceso, b_foda, foda, fodadesc, cuestion, tipo_cuestion, orden): FormGroup {
		return this.formBuilder.group({
			proceso: proceso,
			foda: foda,
			b_foda: b_foda,
			foda_desc: fodadesc,
			cuestion: cuestion,
			tipo_cuestion_desc: tipo_cuestion,
			orden: orden
		});
	}

}
