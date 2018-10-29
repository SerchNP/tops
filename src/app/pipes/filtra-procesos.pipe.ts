import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filtraProcesos'
})
export class FiltraProcesosPipe implements PipeTransform {

	transform(items: any[], accion: string): any {
		if (!items || !accion) {
			return items;
		}
		if (accion === 'AUT') {
			return items.filter(item => item.autorizar.indexOf('S') !== -1);
		}
		if (accion === 'ADM') {
			return items.filter(item => item.administrar.indexOf('S') !== -1);
		}
	}

}
