import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { APP_ROUTES } from './app.routes';

// Modulos
// import { FontAwesomeModule } from '@fortawesome/fontawesome-free';

// Componentes
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer.component';
import { LoginComponent } from './portal/login/login.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';


@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		LoginComponent,
		BreadcrumbsComponent,
		SidebarComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		// FontAwesomeModule,
		APP_ROUTES
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
