import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DetalleComponent } from './home/detalle.component';
import { LoginComponent } from './shared/login/login.component';


const appRoutes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'detalle/:id', component: DetalleComponent },
	{ path: 'login', component: LoginComponent }/*,
	{ path: '**', component: HomeComponent }*/
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true});
