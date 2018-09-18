import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TokenGuard, LoginGuard } from './services.index';
import { AccesoService, SidebarService, IdentidadService } from './services.index';
import { UsuarioService, ProcesosService } from './services.index';
import { AreasService } from './services.index';
import { PuestosService } from './services.index';


@NgModule({
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
		TokenGuard,
		LoginGuard,
		IdentidadService,
		AccesoService,
		SidebarService,
		UsuarioService,
		ProcesosService,
		AreasService,
		PuestosService
	],
	declarations: []
})

export class ServicesModule { }
