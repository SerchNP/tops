import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { URL_SGC, HeadersPOST, HeadersGET } from '../../config/config';
import { Usuario } from '../../interfaces/usuarios.interface';

@Injectable()
export class UsuarioService {

	private RUTA = '/paneladm/usuarios/';
	private TOKEN = 'token=' + localStorage.getItem('token');

	constructor(private http: HttpClient, private router: Router) { }

	getUsuarios(tipo: string, estatus: string) {
		const url = URL_SGC + this.RUTA + 'getUsuarios.json?t=' + tipo + '&e=' + estatus + '&' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	getUsuarioById(usuario: string) {
		const token = localStorage.getItem('token');
		const url = URL_SGC + this.RUTA + 'getUsuarioById.json?user=' + usuario + '&' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	insertarUsuario(usuario: Usuario) {
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

		usuario.matriz.contexto = (usuario.matriz.b_contexto === true ? 'S' : 'N');
		usuario.matriz.liderazgo = (usuario.matriz.b_liderazgo === true ? 'S' : 'N');
		usuario.matriz.riesgo = (usuario.matriz.b_riesgo === true ? 'S' : 'N');
		usuario.matriz.oportunidad = (usuario.matriz.b_oportunidad === true ? 'S' : 'N');
		usuario.matriz.infraestruc = (usuario.matriz.b_infraestruc === true ? 'S' : 'N');
		usuario.matriz.clima_laboral = (usuario.matriz.b_clima_laboral === true ? 'S' : 'N');
		usuario.matriz.capacitacion = (usuario.matriz.b_capacitacion === true ? 'S' : 'N');
		usuario.matriz.control_doctos = (usuario.matriz.b_control_doctos === true ? 'S' : 'N');
		usuario.matriz.salida_nc = (usuario.matriz.b_salida_nc === true ? 'S' : 'N');
		usuario.matriz.queja = (usuario.matriz.b_queja === true ? 'S' : 'N');
		usuario.matriz.satisfaccion = (usuario.matriz.b_satisfaccion === true ? 'S' : 'N');
		usuario.matriz.indicador = (usuario.matriz.b_indicador === true ? 'S' : 'N');
		usuario.matriz.auditor = (usuario.matriz.b_auditor === true ? 'S' : 'N');
		usuario.matriz.revision_dir = (usuario.matriz.b_revision_dir === true ? 'S' : 'N');
		usuario.matriz.no_conformidad = (usuario.matriz.b_no_conformidad === true ? 'S' : 'N');
		usuario.matriz.mejora_continua = (usuario.matriz.b_mejora_continua === true ? 'S' : 'N');

		const url = URL_SGC + this.RUTA + 'insertarUsuario.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(usuario);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	editarUsuario(usuario: Usuario) {
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

		usuario.matriz.contexto = (usuario.matriz.b_contexto === true ? 'S' : 'N');
		usuario.matriz.liderazgo = (usuario.matriz.b_liderazgo === true ? 'S' : 'N');
		usuario.matriz.riesgo = (usuario.matriz.b_riesgo === true ? 'S' : 'N');
		usuario.matriz.oportunidad = (usuario.matriz.b_oportunidad === true ? 'S' : 'N');
		usuario.matriz.infraestruc = (usuario.matriz.b_infraestruc === true ? 'S' : 'N');
		usuario.matriz.clima_laboral = (usuario.matriz.b_clima_laboral === true ? 'S' : 'N');
		usuario.matriz.capacitacion = (usuario.matriz.b_capacitacion === true ? 'S' : 'N');
		usuario.matriz.control_doctos = (usuario.matriz.b_control_doctos === true ? 'S' : 'N');
		usuario.matriz.salida_nc = (usuario.matriz.b_salida_nc === true ? 'S' : 'N');
		usuario.matriz.queja = (usuario.matriz.b_queja === true ? 'S' : 'N');
		usuario.matriz.satisfaccion = (usuario.matriz.b_satisfaccion === true ? 'S' : 'N');
		usuario.matriz.indicador = (usuario.matriz.b_indicador === true ? 'S' : 'N');
		usuario.matriz.auditor = (usuario.matriz.b_auditor === true ? 'S' : 'N');
		usuario.matriz.revision_dir = (usuario.matriz.b_revision_dir === true ? 'S' : 'N');
		usuario.matriz.no_conformidad = (usuario.matriz.b_no_conformidad === true ? 'S' : 'N');
		usuario.matriz.mejora_continua = (usuario.matriz.b_mejora_continua === true ? 'S' : 'N');

		const url = URL_SGC + this.RUTA + 'editarUsuario.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(usuario);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	cancelarUsuario(usuario: string, motivo: string) {
		const url = URL_SGC + this.RUTA + 'cancelarUsuario.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"username": "' + usuario + '", "motivo_cancela": "' + motivo + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	validarPassword(usuario: string, password: string) {
		const url = URL_SGC + this.RUTA + 'validarPass.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"username": "' + usuario + '", "password": "' + btoa(password) + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	actualizarPassword(usuario: string, password: string) {
		const url = URL_SGC + this.RUTA + 'actualizarPass.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(JSON.parse('{"username": "' + usuario + '", "password": "' + btoa(password) + '"}'));
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	actualizarPerfil(usuario: Usuario) {
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

		const url = URL_SGC + this.RUTA + 'actualizarPerfil.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(usuario);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

	getUsuariosProcesos() {
		const url = URL_SGC + this.RUTA + 'getUsuariosProcesos.json?' + this.TOKEN;
		const headers = HeadersGET;
		return this.http.get(url, {headers}).map(resp => resp);
	}

	asignarUsuarioProcesos(userprocs: any) {
		const url = URL_SGC + this.RUTA + 'asignarUsuarioProcesos.json?' + this.TOKEN;
		const headers = HeadersPOST;
		const body = JSON.stringify(userprocs);
		return this.http.post(url, body, { headers }).map(resp => resp);
	}

}
