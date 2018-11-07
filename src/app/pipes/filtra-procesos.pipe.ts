import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filtraProcesos'
})
export class FiltraProcesosPipe implements PipeTransform {

	transform(items: any[], accion: string): any {
		if (!items || !accion) {
			return items;
		}
		if (accion === 'V') {
			return items;
		} else if (accion === 'A') {
			return items.filter(item => item.autorizar.indexOf('S') !== -1);
		} else if (accion === 'R' || accion === 'U' || accion === 'I') {
			return items.filter(item => item.administrar.indexOf('S') !== -1);
		}
	}

}
