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

@Pipe({
	name: 'filtraFodaAut'
})
export class FiltraFodaAutPipe implements PipeTransform {

	transform(items: any[], autoriza: number): any {
		if (!items || !autoriza) {
			return items;
		}
		return items.filter(item => (item.autoriza === autoriza));
	}

}
