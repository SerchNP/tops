import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // if for pipe
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderPrincipalComponent } from './header-principal/header-principal.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { LoginComponent } from './login/login.component';
import { InfoUserComponent } from './info-user/info-user.component';
import { NoPageComponent } from './no-page/no-page.component';

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		HeaderPrincipalComponent,
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		BreadcrumbsComponent,
		LoginComponent,
		InfoUserComponent,
		NoPageComponent
	],
	exports: [
		HeaderPrincipalComponent,
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		BreadcrumbsComponent,
		LoginComponent
	]
})

export class SharedModule { }
