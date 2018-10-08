import { Component, OnInit } from '@angular/core';
import { ProcesosService } from '../../services/services.index';

@Component({
	selector: 'app-procesos-tree',
	templateUrl: './procesos-tree.component.html'
})

export class ProcesosTreeComponent implements OnInit {

	constructor(public _procesosService: ProcesosService) { }

	ngOnInit() { }

	getProcesosTree() {
		let array: any[];
		this._procesosService.getProcesosTree().subscribe((data: any) => {
			array = data.procesos;
		});
		return array;
	}

}
