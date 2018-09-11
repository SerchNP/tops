import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // if for pipe
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { HeaderPrincipalComponent } from './header-principal/header-principal.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { LoginComponent } from './login/login.component';
import { InfoUserComponent } from './info-user/info-user.component';

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [
		// NopagefoundComponent,
		HeaderPrincipalComponent,
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		BreadcrumbsComponent,
		LoginComponent,
		InfoUserComponent
	],
	exports: [
		// NopagefoundComponent,
		HeaderPrincipalComponent,
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		BreadcrumbsComponent,
		LoginComponent
	]
})

export class SharedModule { }
