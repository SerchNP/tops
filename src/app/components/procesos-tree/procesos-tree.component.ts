import { Component } from '@angular/core';
import { ProcesosService } from '../../services/services.index';

@Component({
	selector: 'app-procesos-tree',
	template: '<tree-root [nodes]="nodes" [options]="options"> </tree-root>'
})

export class ProcesosTreeComponent  {

	nodes = [];
	options = {};

	constructor(private _procesos: ProcesosService) {
		this._procesos.getProcesosTree().subscribe((data: any) => {
			this.nodes = data.procesos;
		});
	}

}
