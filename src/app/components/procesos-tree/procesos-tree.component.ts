import { Component, Output, EventEmitter } from '@angular/core';
import { ProcesosService } from '../../services/services.index';

@Component({
	selector: 'app-procesos-tree',
	// tslint:disable-next-line:max-line-length
	template: `	<tree-root [nodes]="nodes" [options]="options" (activate)="onEvent($event)">
				</tree-root>`
})

export class ProcesosTreeComponent  {

	@Output() seleccionado: EventEmitter<string> = new EventEmitter();
	nodes = [];
	options = {animateExpand: true};


	constructor(private _procesos: ProcesosService) {
		this._procesos.getProcesosTree().subscribe((data: any) => {
			this.nodes = data.procesos;
		});
	}

	onEvent = ($event) => {
		const seleccion = $event.node.data;
		const algo = '{"pred":' + seleccion.id + ', "desc": "' + seleccion.name + '"}';
		this.seleccionado.emit(algo);
	}

}
