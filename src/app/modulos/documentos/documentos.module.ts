import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { DocumentosComponent } from './documentos.component';
import { ReportesComponent } from './reportes/reportes.component';

@NgModule({
	imports: [
	CommonModule
	],
	declarations: [
		DocumentosComponent,
		ReportesComponent
	]
})
export class DocumentosModule { }
