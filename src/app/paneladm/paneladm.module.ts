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
import { AreasComponent } from './areas/areas.component';
import { PuestosComponent } from './puestos/puestos.component';
import { PuestosFormularioComponent } from './puestos/puestos-formulario.component';
import { PeriodosComponent } from './periodos/periodos.component';

import { TipoIndicadoresComponent } from './tipo-indicadores/tipo-indicadores.component';
import { ObjetivosCalidadComponent } from './objetivos-calidad/objetivos-calidad.component';



@NgModule({
	declarations: [
		PaneladmComponent,
		UsuariosComponent,
		UsuariosFormularioComponent,
		ProcesosComponent,
		ProcesosFormularioComponent,
		AreasComponent,
		PuestosComponent,
		PuestosFormularioComponent
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
