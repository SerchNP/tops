import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'app-arbol',
	template: ` <div class="row" style="margin-left: 5px;">
		<input class="form-control col-sm-6" id="filter" #filter
		(keyup)="tree.treeModel.filterNodes(filter.value)" placeholder="Buscar"/>
		&nbsp;<button class="btn btn-xs btn-secondary" (click)="tree.treeModel.clearFilter()">
			<i class="fas fa-search-minus"></i>
		</button>
	</div>
	<div style="height: 250px">
		<tree-root #tree
			[focused]="true"
			[nodes]="nodes"
			[options]="options"
			(activate)="onEvent($event)">
		</tree-root>
	</div>`
})

export class ArbolComponent  {

	@Input() nodes = [];

	@Output() seleccionado: EventEmitter<string> = new EventEmitter();

	options = {
		animateExpand: true,
		animateSpeed: 17
	};


	constructor() {}

	onEvent = ($event) => {
		const seleccion = $event.node.data;
		const algo = '{"id":"' + seleccion.id + '", "name": "' + seleccion.name + '"}';
		this.seleccionado.emit(algo);
	}

}
