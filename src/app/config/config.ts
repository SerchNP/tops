import { HttpHeaders } from '@angular/common/http';

// Ruta del servicio
/// export const URL_SGC = 'http://localhost:8080/SGCWS/rest';
export const URL_SGC = 'http://sistemas.ujed.mx/SGCWS/rest';

export const AUTH = 'UG9ydGFsU0dDOlM2QzNuNGJsM2Q=';

export const HeadersPOST: HttpHeaders = new HttpHeaders({
	'authorization': 'Basic ' + AUTH,
	'Content-Type' : 'application/json'
});

export const HeadersGET: HttpHeaders = new HttpHeaders({
	'authorization': 'Basic ' + AUTH
});
