import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filtraObjetivo'
})
export class FiltraObjetivoPipe implements PipeTransform {

	transform(items: any[], filtro?: number): any {
		if (!items || !filtro) {
			return items;
		}
		return items.filter(item => item.clave === filtro);
	}

}
