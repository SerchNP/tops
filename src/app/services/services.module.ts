import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TokenGuard, LoginGuard } from './services.index';
import { AccesoService, SidebarService, HomeService } from './services.index';
import { UsuarioService, ProcesosService } from './services.index';
import { AreasService, PuestosService } from './services.index';
import { IdentidadService } from './services.index';
import { FodaService } from './panelfoda/foda.service';
import { CatalogosService } from './shared/catalogos.service';


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
		CatalogosService,
		UsuarioService,
		ProcesosService,
		AreasService,
		PuestosService,
		IdentidadService,
		FodaService
	],
	declarations: []
})

export class ServicesModule { }
