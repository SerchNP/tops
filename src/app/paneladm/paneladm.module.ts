import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { PANELADM_ROUTES } from './paneladm.routes';

// Modulos
import { TreeModule } from 'angular-tree-component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng2TableModule } from 'ng2-table/ng2-table';

// Componentes
import { PaneladmComponent } from './paneladm.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFormularioComponent } from './usuarios/usuarios-formulario.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { ProcesosFormularioComponent } from './procesos/procesos-formulario.component';
import { AreasComponent } from './areas/areas.component';
import { PuestosComponent } from './puestos/puestos.component';
import { PeriodosComponent } from './periodos/periodos.component';

import { TipoIndicadoresComponent } from './tipo-indicadores/tipo-indicadores.component';
import { ObjetivosCalidadComponent } from './objetivos-calidad/objetivos-calidad.component';
import { ArbolComponent } from '../components/arbol/arbol.component';
import { DataTableComponent } from '../components/data-table/data-table.component';


@NgModule({
	declarations: [
		PaneladmComponent,
		UsuariosComponent,
		UsuariosFormularioComponent,
		ProcesosComponent,
		ProcesosFormularioComponent,
		ArbolComponent,
		AreasComponent,
		PuestosComponent,
		DataTableComponent
	],
	exports: [
		PaneladmComponent
	],
	imports: [
		CommonModule,
		PANELADM_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		TreeModule.forRoot(),
		PaginationModule.forRoot(),
		Ng2TableModule
	]
})

export class PaneladmModule { }
