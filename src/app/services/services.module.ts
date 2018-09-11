import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginGuardGuard, UsersService, SidebarService, UsuarioService, ProcesosService } from './services.index';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
		LoginGuardGuard,
		UsersService,
		SidebarService,
		UsuarioService,
		ProcesosService
	],
	declarations: []
})

export class ServicesModule { }
