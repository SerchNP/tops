import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {

	menu: any = [
		{
			titulo : 'Principal',
			icono : 'mdi mdi-gauge',
			submenu : [
				{titulo: 'Dashboard', url: '/dashboard'}
			]
		},
		{
			titulo : 'Principal2',
			icono : 'mdi mdi-gauge',
			submenu : [
				{titulo: 'Dashboard', url: '/dashboard'}
			]
		}
	];

	constructor() { }

}
