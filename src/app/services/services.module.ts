import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TokenGuard, LoginGuard, AccesoService, SidebarService, UsuarioService, ProcesosService, PrincipalService } from './services.index';


@NgModule({
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
		TokenGuard,
		LoginGuard,
		PrincipalService,
		AccesoService,
		SidebarService,
		UsuarioService,
		ProcesosService
	],
	declarations: []
})

export class ServicesModule { }
