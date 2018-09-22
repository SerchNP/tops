import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { ASIGNACIONES_ROUTES } from './asignacion.routes';

// Modulos
import { TreeModule } from 'angular-tree-component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng2TableModule } from 'ng2-table/ng2-table';


import { AsignacionesComponent } from './asignaciones.component';
import { AreaProcesoComponent } from './area-proceso/area-proceso.component';
import { ProcesoUsuarioComponent } from './proceso-usuario/proceso-usuario/proceso-usuario.component';
import { MenuUsuarioComponent } from './menu-usuario/menu-usuario.component';

@NgModule ({
	declarations: [
		AsignacionesComponent,
		AreaProcesoComponent,
		ProcesoUsuarioComponent,
		MenuUsuarioComponent
	],
	exports: [
		AsignacionesComponent
	],
	imports: [
		CommonModule,
		ASIGNACIONES_ROUTES,
		FormsModule,
		ReactiveFormsModule,
		TreeModule.forRoot(),
		PaginationModule.forRoot(),
		Ng2TableModule
	]
})
export class AsignacionesModule { }
