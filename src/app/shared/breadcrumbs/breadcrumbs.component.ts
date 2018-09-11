import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
	selector: 'app-breadcrumbs',
	templateUrl: './breadcrumbs.component.html',
	styles: []
})

export class BreadcrumbsComponent implements OnInit {

	padre: string;
	opcion: string;
	titulo: string;

	constructor(private router: Router, private title: Title, private meta: Meta) {
		this.getDataRoute().subscribe( event => {
			// console.log(event);
			this.padre = event.padre;
			this.opcion = event.opcion;
			this.titulo = event.titulo;
			/* Las siguientes líneas son para modificar el nombre de la pestaña del navegador */
			/*this.title.setTitle(this.titulo);
			const metaTag: MetaDefinition = {
				name: 'description',
				content: this.titulo
			};
			this.meta.updateTag(metaTag);*/
		});
	}

	ngOnInit() { }

	getDataRoute() {
		return this.router.events.pipe(
			filter(evento => evento instanceof ActivationEnd),
			filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
			map((evento: ActivationEnd) => evento.snapshot.data)
		);
	}

}
