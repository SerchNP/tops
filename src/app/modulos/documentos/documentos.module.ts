import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routes
import { DOCUMENTOS_ROUTES } from './documentos.routes';

// Components
import { DocumentosComponent } from './documentos.component';
import { ReportesComponent } from './reportes/reportes.component';

@NgModule({
	imports: [
		CommonModule,
		DOCUMENTOS_ROUTES
	],
	declarations: [
		DocumentosComponent,
		ReportesComponent
	]
})
export class DocumentosModule { }
