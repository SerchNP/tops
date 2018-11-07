import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filtraFoda'
})
export class FiltraFodaPipe implements PipeTransform {

	transform(items: any[], tipoCuestion: string, autoriza?: number): any {
		if (!items || !tipoCuestion) {
			return items;
		}
		if (!autoriza) {
			return items.filter(item => item.cuestion.indexOf(tipoCuestion) !== -1);
		} else {
			return items.filter(item => (item.cuestion.indexOf(tipoCuestion) !== -1 && item.autoriza === autoriza));
		}
	}

}
