import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccesoService, UsuarioService, AreasService, ProcesosService } from '../../services/services.index';
import swal from 'sweetalert2';

@Component({
	selector: 'app-usuario-proceso-formulario',
	templateUrl: './usuario-proceso-formulario.component.html'
})

export class UsuarioProcesoFormularioComponent implements OnInit, OnDestroy {

	private sub: any;
	accion: string;
	usuario: number;
	proceso: string;

	titulo: string;
	forma: FormGroup;
	cancelar: any[] = ['/paneladm', 'submenuusu', 'usuario_proceso'];

	usuariosTemp: any[];
	usuarios: any[] = [];
	seleccionado = '';
	procesos: any[] = [];

	constructor(private activatedRoute: ActivatedRoute,
				private _acceso: AccesoService, private _usuario: UsuarioService,
				private _area: AreasService, private _procesos: ProcesosService) {
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			try { this.usuario = params['user']; } catch (e) { console.log(e); }
			try { this.proceso = params['proc']; } catch (e) { console.log(e); }
			this.titulo = 'Asignación de Procesos a Usuarios';
		});
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'usuario' : new FormControl('', Validators.required),
			'nombre': new FormControl(),
			'area' : new FormControl(),
			'area_desc' : new FormControl()
		});
		this.cargarUsuarios();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	cargarUsuarios() {
		this._usuario.getUsuarios('N', 'A')
			.subscribe(
				(data: any) => {
					this.usuariosTemp = data.usuarios;
					this.usuariosTemp.forEach((x) => {
						const json = '{"id" : "' + x.usuario + '", "name" : "' + x.nombre + ' ' + x.paterno + ' ' + x.materno + '"}';
						this.usuarios.push(JSON.parse(json));
					});
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	asignarUsuario() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.forma.get('usuario').setValue(json.id);
			this.forma.get('nombre').setValue(json.name);
			document.getElementById('close').click();
			this._usuario.getUsuarioById(json.id)
				.subscribe(
					(data: any) => {
						this._acceso.guardarStorage(data.token);
						this.getAreaFromUsuario(data.usuario.area);
						this.getProcesosFromUsuario(json.id);
					},
					error => {
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					});
		} else {
			swal('Error', 'No se ha seleccionado el usuario', 'error');
		}
	}

	getAreaFromUsuario(area: number) {
		this._area.getAreaById(area)
			.subscribe(
				(data: any) => {
					this.forma.get('area').setValue(data.area.area);
					this.forma.get('area_desc').setValue(data.area.area_desc);
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getProcesosFromUsuario(usuario: string) {
		this._procesos.getProcesosByUserArea(usuario)
			.subscribe(
				(data: any) => {
					this.procesos = data.procesos;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

}
