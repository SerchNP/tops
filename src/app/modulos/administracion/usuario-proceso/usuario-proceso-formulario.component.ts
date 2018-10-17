import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { AccesoService, UsuarioService, AreasService, ProcesosService } from '../../../services/services.index';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { DerechosService } from '../../../services/shared/derechos.service';

@Component({
	selector: 'app-usuario-proceso-formulario',
	templateUrl: './usuario-proceso-formulario.component.html'
})

export class UsuarioProcesoFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	accion: string;
	usuario: string;
	proceso: number;

	titulo: string;
	forma: FormGroup;
	userprocs: FormArray;
	cancelar: any[] = ['/administracion', 'submenuusu', 'usuario_proceso'];

	usuariosTemp: any[];
	usuarios: any[] = [];
	seleccionado = '';
	procesos: any[] = [];

	constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
				private _acceso: AccesoService, private _usuario: UsuarioService,
				private _derechos: DerechosService,
				private _area: AreasService, private _procesos: ProcesosService) {
		this.subscription = this.activatedRoute.params.subscribe(params => {
			this.accion = params['acc'];
			try { this.usuario = params['user']; } catch (e) { console.log(e); }
			try { this.proceso = params['proc']; } catch (e) { console.log(e); }
			this.titulo = 'Asignación de Procesos a Usuarios';
		});
	}

	ngOnInit() {
		this.forma = this.formBuilder.group({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			usuario: '',
			nombre: '',
			area: '',
			area_desc: '',
			userprocs: this.formBuilder.array([])
		});
		this.cargarUsuarios(this.usuario);
	}

	createItem(user, idproc, procdesc, idmenu, menudesc, padm, padmbol, paut, pautbol): FormGroup {
		return this.formBuilder.group({
			usuario: user,
			proceso: idproc,
			proceso_desc: procdesc,
			menu: idmenu,
			menu_desc: menudesc,
			administrar: padm,
			b_administrar: padmbol,
			autorizar: paut,
			b_autorizar: pautbol
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	cargarUsuarios(username?: string) {
		if (username !== undefined) {
			this.subscription = this._usuario.getUsuarioById(username)
				.subscribe(
					(data: any) => {
						this._acceso.guardarStorage(data.token);
						this.forma.get('usuario').setValue(data.usuario.username);
						this.forma.get('nombre').setValue(data.usuario.nombre + ' ' + data.usuario.paterno + ' ' + data.usuario.materno);
						this.getAreaFromUsuario(data.usuario.area);
						this.getProcesosFromUsuario(data.usuario.username, data.usuario.area);
					});
		} else {
			this.subscription = this._usuario.getUsuarios('N', 'A')
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
	}

	asignarUsuario() {
		if (this.seleccionado.length > 0) {
			const json = JSON.parse(this.seleccionado);
			this.forma.get('usuario').setValue(json.id);
			this.forma.get('nombre').setValue(json.name);
			document.getElementById('close').click();

			this.subscription = this._usuario.getUsuarioById(json.id)
				.subscribe(
					(data: any) => {
						this._acceso.guardarStorage(data.token);
						this.getAreaFromUsuario(data.usuario.area);
						this.getProcesosFromUsuario(json.id, data.usuario.area);
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
		this.subscription = this._area.getAreaById(area)
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

	getProcesosFromUsuario(usuario: string, area: number) {
		this.subscription = this._derechos.getProcesosMenuAsignable(usuario, area)
			.subscribe(
				(data: any) => {
					this.procesos = data.listado;
					this.procesos.forEach((p) => this.addItem(usuario, p));
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	addItem(usuario, p): void {
		this.userprocs = this.forma.get('userprocs') as FormArray;
		if (this.proceso !== undefined) {
			if (p.proceso === Number(this.proceso)) {
				// tslint:disable-next-line:max-line-length
				this.userprocs.push(this.createItem(usuario, p.proceso, p.proceso_desc, p.menu, p.menu_desc, p.administrar, p.administrar === 'S', p.autorizar, p.autorizar === 'S'));
			}
		} else {
			// tslint:disable-next-line:max-line-length
			this.userprocs.push(this.createItem(usuario, p.proceso, p.proceso_desc, p.menu, p.menu_desc, p.administrar, p.administrar === 'S', p.autorizar, p.autorizar === 'S'));
		}
	}

	guardar() {
		const listado = this.forma.get('userprocs') as FormArray;
		const listadoFinal = [];
		listado.value.forEach(element => {
			if (element.b_administrar || element.b_autorizar) {
				if (element.b_administrar) {
					element.administrar = 'S';
				} else {
					element.administrar = 'N';
				}
				if (element.b_autorizar) {
					element.autorizar = 'S';
				} else {
					element.autorizar = 'N';
				}
				listadoFinal.push(element);
			}
		});
		if (listadoFinal.length === 0) {
			if (this.accion === 'U') {
				swal('ERROR', 'Debe seleccionar al menos un atributo del proceso', 'error');
			} else {
				swal('ERROR', 'Debe seleccionar al menos un atributo de alguno de los procesos asignados al área', 'error');
			}
		} else {
			this.subscription = this._derechos.asignarUsuarioMenuProceso(listadoFinal)
				.subscribe((data: any) => {
					swal('Atención!!!', data.message, 'success');
					if (this.accion === 'U') {
						this.router.navigate(['/administracion', 'submenuusu', 'usuario_proceso']);
					} else {
						this.ngOnInit();
					}
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
		}
	}

}
