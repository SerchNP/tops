import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService, AccesoService } from '../../services/services.index';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

	constructor(public _sidebar: SidebarService, private _router: Router, public _accesoService: AccesoService) { }

	ngOnInit() {
	}

}
