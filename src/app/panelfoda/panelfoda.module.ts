import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Rutas
import { PANELFODA_ROUTES } from './panelfoda.routes';

// Modulos
import { PaginationModule } from 'ngx-bootstrap/pagination';

// Componentes
import { PanelfodaComponent } from './panelfoda.component';
import { AmenazasComponent } from './amenazas/amenazas.component';
import { OportunidadesComponent } from './oportunidades/oportunidades.component';
import { DebilidadesComponent } from './debilidades/debilidades.component';
import { FortalezasComponent } from './fortalezas/fortalezas.component';
import { DataTableComponent } from '../components/data-table/data-table.component';

@NgModule({
	imports: [
		CommonModule,
		PANELFODA_ROUTES,
		DataTableComponent,
		PaginationModule.forRoot()
	],
	declarations: [
		PanelfodaComponent,
		AmenazasComponent,
		OportunidadesComponent,
		DebilidadesComponent,
		FortalezasComponent
	]
})
export class PanelfodaModule { }
