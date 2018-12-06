import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { ADMINISTRACION_ROUTES } from './administracion.routes';

// Modulos
import { ComponentModule } from '../../components/component.module';
import { PipesModule } from '../../pipes/pipes.module';

// Componentes
import { AdministracionComponent } from './administracion.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFormularioComponent } from './usuarios/usuarios-formulario.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ProcesosFormularioComponent } from './procesos/procesos-formulario.component';
import { AreaProcesoComponent } from './area-proceso/area-proceso.component';
import { AreaProcesoFormularioComponent } from './area-proceso/area-proceso-formulario.component';

import { AreasComponent } from './areas/areas.component';
import { AreasFormularioComponent } from './areas/areas-formulario.component';
import { PuestosComponent } from './puestos/puestos.component';
import { PuestosFormularioComponent } from './puestos/puestos-formulario.component';
import { IdentidadComponent } from './identidad/identidad.component';
import { IdentidadFormularioComponent } from './identidad/identidad-formulario.component';
import { UsuarioProcesoComponent } from './usuario-proceso/usuario-proceso.component';
import { UsuarioProcesoFormularioComponent } from './usuario-proceso/usuario-proceso-formulario.component';
import { FrecuenciasMedicionComponent } from './catalogos/frecuencias-medicion.component';
import { FrecuenciasMedicionFormularioComponent } from './catalogos/frecuencias-medicion-formulario.component';
import { FormulasComponent } from './catalogos/formulas.component';
import { FormulasFormularioComponent } from './catalogos/formulas-formulario.component';
import { TResultadosComponent } from './catalogos/tresultados.component';
import { TresultadosFormularioComponent } from './catalogos/tresultados-formulario.component';
import { PeriodosComponent } from './catalogos/periodos.component';
import { PeriodosFormularioComponent } from './catalogos/periodos-formulario.component';
import { ArchivosComponent } from './archivos/archivos.component';


@NgModule({
	declarations: [
		AdministracionComponent,
		UsuariosComponent,
		UsuariosFormularioComponent,
		ProcesosComponent,
		ProcesosFormularioComponent,
		AreaProcesoComponent,
		AreaProcesoFormularioComponent,
		AreasComponent,
		AreasFormularioComponent,
		PuestosComponent,
		PuestosFormularioComponent,
		IdentidadComponent,
		IdentidadFormularioComponent,
		UsuarioProcesoComponent,
		UsuarioProcesoFormularioComponent,
		FrecuenciasMedicionComponent,
		FrecuenciasMedicionFormularioComponent,
		FormulasComponent,
		FormulasFormularioComponent,
		TResultadosComponent,
		TresultadosFormularioComponent,
		PeriodosComponent,
		PeriodosFormularioComponent,
		ArchivosComponent
	],
	exports: [
		AdministracionComponent
	],
	imports: [
		PipesModule,
		CommonModule,
		ADMINISTRACION_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		ComponentModule
	]
})

export class AdministracionModule { }
