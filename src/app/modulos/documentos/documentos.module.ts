import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// Routes
import { DOCUMENTOS_ROUTES } from './documentos.routes';

// Components
import { DocumentosComponent } from './documentos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { HistoricoComponent } from './historico/historico.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		DOCUMENTOS_ROUTES,
		PdfViewerModule
	],
	declarations: [
		DocumentosComponent,
		ReportesComponent,
		HistoricoComponent
	]
})
export class DocumentosModule { }
