import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filtraColumns'
})

export class FiltraColumnsPipe implements PipeTransform {

	transform(items: any[], filtro?: boolean): any {
		if (!items || filtro === undefined) {
			return items;
		}
		return items.filter(item => (item.visible === undefined ? true : item.visible) === filtro);
	}

}
