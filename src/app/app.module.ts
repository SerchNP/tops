import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { APP_ROUTES } from './app.routes';

// Modulos
import { TreeModule } from 'angular-tree-component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

// Services
import { ServicesModule } from './services/services.module';

// Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DetalleComponent } from './home/detalle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogDetalleComponent } from './components/dialog-detalle/dialog-detalle.component';


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		DetalleComponent,
		DialogDetalleComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		APP_ROUTES,
		TreeModule,
		PagesModule,
		SharedModule,
		ServicesModule,
		BrowserAnimationsModule,
		MatDialogModule
	],
	exports: [
		MatDialogModule
	],
	schemas: [ NO_ERRORS_SCHEMA ],
	providers: [
		{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
	],
	entryComponents: [
		DialogDetalleComponent
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
