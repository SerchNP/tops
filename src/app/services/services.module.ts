import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TokenGuard, LoginGuard, TipoUsuarioGuard } from './services.index';
import { AccesoService, SidebarService, HomeService } from './services.index';
import { UsuarioService, ProcesosService } from './services.index';
import { AreasService, PuestosService } from './services.index';
import { IdentidadService } from './services.index';
import { FodaService } from './contexto/foda.service';
import { CatalogosService } from './shared/catalogos.service';
import { DerechosService } from './shared/derechos.service';
import { IndicadoresService } from './indicadores/indicadores.service';
import { RiesgoService } from './riesgos/riesgo.service';
import { DireccionService } from './contexto/direccion.service';
import { FichaProcesoService } from './contexto/ficha-proceso.service';


@NgModule({
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
		TokenGuard,
		LoginGuard,
		TipoUsuarioGuard,
		HomeService,
		AccesoService,
		SidebarService,
		DerechosService,
		CatalogosService,
		UsuarioService,
		ProcesosService,
		AreasService,
		PuestosService,
		IdentidadService,
		FodaService,
		IndicadoresService,
		RiesgoService,
		DireccionService,
		FichaProcesoService
	],
	declarations: []
})

export class ServicesModule { }
