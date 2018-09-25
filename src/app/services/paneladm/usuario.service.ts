import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, AUTH } from '../../config/config';
import { Usuario } from '../../interfaces/usuarios.interface';

@Injectable()
export class UsuarioService {

	constructor(private http: HttpClient, private router: Router) { }

	private getHeadersPOST(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH,
			'Content-Type' : 'application/json'
		});
		return headers;
	}

	private getHeadersGET(): HttpHeaders {
		const headers = new HttpHeaders({
			'authorization': 'Basic ' + AUTH
		});
		return headers;
	}

	getUsuarios() {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/usuarios/getUsuarios.json?token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getUsuarioById(usuario: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/usuarios/getUsuarioById.json?user=' + usuario + '&token=' + token;
		const headers = this.getHeadersGET();
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarUsuario(usuario: Usuario, matriz: any) {
		console.log(usuario);
		console.log(matriz);

		if (usuario.materno === null) {
			delete usuario['materno'];
		}
		if (usuario.email === null) {
			delete usuario['email'];
		}
		if (usuario.email2 === null) {
			delete usuario['email2'];
		}
		if (usuario.email3 === null) {
			delete usuario['email3'];
		}

		matriz['contexto'] = (matriz.contexto === null ? 'N' : 'S');
		matriz.liderazgo = (matriz.liderazgo === null ? 'N' : 'S');
		matriz.riesgo = (matriz.riesgo === null ? 'N' : 'S');
		matriz.oportunidad = (matriz.oportunidad === null ? 'N' : 'S');
		matriz.infraestructura = (matriz.infraestructura === null ? 'N' : 'S');
		matriz.clima = (matriz.clima === null ? 'N' : 'S');
		matriz.capacitacion = (matriz.capacitacion === null ? 'N' : 'S');
		matriz.control = (matriz.control === null ? 'N' : 'S');
		matriz.salidanc = (matriz.salidanc === null ? 'N' : 'S');
		matriz.quejas = (matriz.quejas === null ? 'N' : 'S');
		matriz.satisfaccion = (matriz.satisfaccion === null ? 'N' : 'S');
		matriz.indicadores = (matriz.indicadores === null ? 'N' : 'S');
		matriz.auditor = (matriz.auditor === null ? 'N' : 'S');
		matriz.revision = (matriz.revision === null ? 'N' : 'S');
		matriz.noconf = (matriz.noconf === null ? 'N' : 'S');
		matriz.mejora = (matriz.mejora === null ? 'N' : 'S');
		const bodym = JSON.stringify(matriz);
		console.log(bodym);
		const token = ''; // localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/usuarios/insertarUsuario.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(usuario);
		console.log(body);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editarUsuario(usuario: Usuario) {
		if (usuario.email2 === null) {
			delete usuario['email2'];
		}
		if (usuario.email3 === null) {
			delete usuario['email3'];
		}
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/usuarios/editarUsuario.json?token=' + token;
		const headers = this.getHeadersPOST();
		console.log(usuario);
		const body = JSON.stringify(usuario);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	/*cancelaProceso(usuario: string, motivo: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + '/catalogos/procesos/cancelaProceso.json?token=' + token;
		const headers = this.getHeadersPOST();
		const body = JSON.stringify(JSON.parse('{"proceso": ' + proceso + ', "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}*/

}
