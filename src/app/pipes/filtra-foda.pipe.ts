import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filtraFoda'
})
export class FiltraFodaPipe implements PipeTransform {

	transform(items: any[], filtro: string): any {
		if (!items || !filtro) {
			return items;
		}
		return items.filter(item => item.cuestion.indexOf(filtro) !== -1);
	}

}
