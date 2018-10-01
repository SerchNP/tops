import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PANELADM_ROUTES } from './paneladm.routes';

// Modulos
import { ComponentModule } from '../components/component.module';

// Componentes
import { PaneladmComponent } from './paneladm.component';
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
import { ObjetivosCalidadComponent } from './objetivos-calidad/objetivos-calidad.component';
import { ObjetivosCalidadFormComponent } from './objetivos-calidad/objetivos-calidad-form.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { TipoIndicadoresComponent } from './tipo-indicadores/tipo-indicadores.component';


@NgModule({
	declarations: [
		PaneladmComponent,
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
		ObjetivosCalidadComponent,
		ObjetivosCalidadFormComponent
	],
	exports: [
		PaneladmComponent
	],
	imports: [
		CommonModule,
		PANELADM_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		ComponentModule
	]
})

export class PaneladmModule { }
