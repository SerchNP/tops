import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
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
	userprocs: FormArray;
	cancelar: any[] = ['/paneladm', 'submenuusu', 'usuario_proceso'];

	usuariosTemp: any[];
	usuarios: any[] = [];
	seleccionado = '';
	procesos: any[] = [];

	constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
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
		this.forma = this.formBuilder.group({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			usuario: '',
			nombre: '',
			area: '',
			area_desc: '',
			userprocs: this.formBuilder.array([])
		});
		this.cargarUsuarios();
	}

	createItem(user, idproc, procdesc, padm, padmbol, paut, pautbol): FormGroup {
		return this.formBuilder.group({
			usuario: user,
			proceso: idproc,
			proceso_desc: procdesc,
			administra: padm,
			b_administrar: padmbol,
			autoriza: paut,
			b_autorizar: pautbol
		});
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
					this.procesos.forEach((p) => this.addItem(usuario, p));
					console.log(this.userprocs);
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
		// tslint:disable-next-line:max-line-length
		this.userprocs.push(this.createItem(usuario, p.proceso, p.proceso_desc, p.insertar, p.insertar === 'S', p.autorizar, p.autorizar === 'S'));
	}

	guardar() {
		const listado = this.forma.get('userprocs') as FormArray;
		const listadoFinal = [];
		listado.value.forEach(element => {
			if (element.b_administrar || element.b_autorizar) {
				if (element.b_administrar) {
					element.administra = 'S';
				}
				if (element.b_autorizar) {
					element.autoriza = 'S';
				}
				listadoFinal.push(element);
			}
		});

		this._usuario.asignarUsuarioProcesos(listadoFinal)
			.subscribe((data: any) => {
				swal('Atención!!!', data.message, 'success');
				this.ngOnInit();
			},
			error => {
				swal('ERROR', error.error.message, 'error');
				if (error.error.code === 401) {
					this._acceso.logout();
				}
			});
	}

}
