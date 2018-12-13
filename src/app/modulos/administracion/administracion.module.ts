import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { ADMINISTRACION_ROUTES } from './administracion.routes';

// Modulos
import { BrowserModule } from '@angular/platform-browser';
import { ComponentModule } from '../../components/component.module';
import { PipesModule } from '../../pipes/pipes.module';
import { MatRadioModule } from '@angular/material';
import { BlockUIModule } from 'ng-block-ui';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// Componentes
import { AdministracionComponent } from './administracion.component';

// Componentes
import { FrecuenciasMedicionComponent } from './catalogos/frecuencias-medicion.component';
import { FrecuenciasMedicionFormularioComponent } from './catalogos/frecuencias-medicion-formulario.component';
import { FormulasComponent } from './catalogos/formulas.component';
import { FormulasFormularioComponent } from './catalogos/formulas-formulario.component';
import { TResultadosComponent } from './catalogos/tresultados.component';
import { TresultadosFormularioComponent } from './catalogos/tresultados-formulario.component';
import { PeriodosComponent } from './catalogos/periodos.component';
import { PeriodosFormularioComponent } from './catalogos/periodos-formulario.component';
import { AccionesComponent } from './catalogos/acciones.component';
import { CuestionesComponent } from './catalogos/cuestiones.component';
import { EdosRiesgoComponent } from './catalogos/edos-riesgo.component';
import { EstrategiasComponent } from './catalogos/estrategias.component';
import { ImpactoComponent } from './catalogos/impacto.component';
import { NivelRiesgoComponent } from './catalogos/nivel-riesgo.component';
import { OcurrenciaComponent } from './catalogos/ocurrencia.component';
import { AreasComponent } from './areas/areas.component';
import { AreasFormularioComponent } from './areas/areas-formulario.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ProcesosFormularioComponent } from './procesos/procesos-formulario.component';
import { AreaProcesoComponent } from './area-proceso/area-proceso.component';
import { AreaProcesoFormularioComponent } from './area-proceso/area-proceso-formulario.component';
import { PuestosComponent } from './puestos/puestos.component';
import { PuestosFormularioComponent } from './puestos/puestos-formulario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFormularioComponent } from './usuarios/usuarios-formulario.component';
import { UsuarioProcesoComponent } from './usuario-proceso/usuario-proceso.component';
import { UsuarioProcesoFormularioComponent } from './usuario-proceso/usuario-proceso-formulario.component';
import { IdentidadComponent } from './identidad/identidad.component';
import { IdentidadFormularioComponent } from './identidad/identidad-formulario.component';
import { ArchivoGeneraComponent } from './archivos/archivo-genera.component';
import { ArchivoVisuaizarComponent } from './archivos/archivo-visuaizar.component';


@NgModule({
	declarations: [
		AdministracionComponent,
		FrecuenciasMedicionComponent,
		FrecuenciasMedicionFormularioComponent,
		FormulasComponent,
		FormulasFormularioComponent,
		TResultadosComponent,
		TresultadosFormularioComponent,
		PeriodosComponent,
		PeriodosFormularioComponent,
		AccionesComponent,
		CuestionesComponent,
		EdosRiesgoComponent,
		EstrategiasComponent,
		ImpactoComponent,
		NivelRiesgoComponent,
		OcurrenciaComponent,
		AreasComponent,
		AreasFormularioComponent,
		ProcesosComponent,
		ProcesosFormularioComponent,
		AreaProcesoComponent,
		AreaProcesoFormularioComponent,
		PuestosComponent,
		PuestosFormularioComponent,
		UsuariosComponent,
		UsuariosFormularioComponent,
		UsuarioProcesoComponent,
		UsuarioProcesoFormularioComponent,
		IdentidadComponent,
		IdentidadFormularioComponent,
		ArchivoGeneraComponent,
		ArchivoVisuaizarComponent
	],
	exports: [
		AdministracionComponent
	],
	imports: [
		BrowserModule,
		PipesModule,
		CommonModule,
		ADMINISTRACION_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		ComponentModule,
		MatRadioModule,
		BlockUIModule.forRoot(),
		PdfViewerModule
	]
})

export class AdministracionModule { }
