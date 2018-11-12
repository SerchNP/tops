import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filtraTipoEstrateg'
})
export class FiltraTipoEstrategiaPipe implements PipeTransform {

	transform(items: any[], clave?: number): any {
		if (!items || !clave) {
			return items;
		}
		return items.filter(item => item.clave === clave);
	}

}
