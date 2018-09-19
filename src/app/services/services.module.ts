import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TokenGuard, LoginGuard } from './services.index';
import { AccesoService, SidebarService, HomeService } from './services.index';
import { UsuarioService, ProcesosService } from './services.index';
import { AreasService, PuestosService } from './services.index';
import { IdentidadService } from './services.index';


@NgModule({
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
		TokenGuard,
		LoginGuard,
		HomeService,
		AccesoService,
		SidebarService,
		UsuarioService,
		ProcesosService,
		AreasService,
		PuestosService,
		IdentidadService
	],
	declarations: []
})

export class ServicesModule { }
