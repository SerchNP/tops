import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rutas
import { APP_ROUTES } from './app.routes';

// Modulos
import { TreeModule } from 'angular-tree-component';

import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

// Services
import { ServicesModule } from './services/services.module';

// Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DetalleComponent } from './home/detalle.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		DetalleComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		APP_ROUTES,
		TreeModule,
		PagesModule,
		SharedModule,
		ServicesModule
	],
	schemas: [ NO_ERRORS_SCHEMA ],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
