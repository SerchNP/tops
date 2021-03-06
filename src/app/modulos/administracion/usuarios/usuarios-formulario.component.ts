import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccesoService, UsuarioService, AreasService, PuestosService } from '../../../services/services.index';
import { correoValidator, correo2Validator, correo3Validator } from '../../../directivas/correo-validator.directive';
import { Usuario } from '../../../interfaces/usuarios.interface';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { compilePipeFromMetadata } from '@angular/compiler';

@Component({
	selector: 'app-usuarios-formulario',
	templateUrl: './usuarios-formulario.component.html',
	styleUrls: ['./usuarios.component.css']
})

export class UsuariosFormularioComponent implements OnInit, OnDestroy {

	private subscription: Subscription;
	accion: string;
	idUsuario: string;
	titulo: string;

	formaUsuarios: FormGroup;
	areas: any[] = [];
	puestos: any[] = [];
	usuario: Usuario;
	cancelar: any[] = ['/administracion', 'submenuusu', 'usuarios'];

	constructor(private router: Router,
				private activated: ActivatedRoute,
				public _acceso: AccesoService,
				private _usuario: UsuarioService,
				private _areas: AreasService,
				private _puestos: PuestosService) {
		this.subscription = this.activated.params.subscribe(params => {
			this.accion = params['acc'];
			this.idUsuario = params['id'];
		});

		let pre = '';
		switch (this.accion) {
			case 'I':	pre = 'Registro';		break;
			case 'U':	pre = 'Actualización';	break;
			case 'V':	pre = 'Consulta';		break;
		}

		this.titulo = pre + ' de Usuarios';

		if (this.accion === 'U' || this.accion === 'V') {
			this.cargarUsuario(this.idUsuario);
		}
	}

	ngOnInit() {
		this.getAreas();
		this.getPuestos();
		this.formaUsuarios = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'username' : new FormControl('', [Validators.required, Validators.minLength(3)]),
			'titulo': new FormControl('C.', Validators.required),
			'nombre' : new FormControl('', Validators.required),
			'paterno' : new FormControl('', Validators.required),
			'materno' : new FormControl(),
			'email': new FormControl(''), // Validators.pattern("([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+\.+([a-z0-9]{2,4})+$")
			'email2': new FormControl(''), // Validators.pattern("([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+\.+([a-z0-9]{2,4})+$")
			'email3': new FormControl(''), // Validators.pattern("([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+\.+([a-z0-9]{2,4})+$")
			'area' : new FormControl('', Validators.required),
			'puesto' : new FormControl('', Validators.required),
			'tipo' : new FormControl('', Validators.required),
			'matriz': new FormGroup({
				'b_contexto': new FormControl(),
				'b_liderazgo': new FormControl(),
				'b_riesgo': new FormControl(),
				'b_oportunidad': new FormControl(),
				'b_infraestruc': new FormControl(),
				'b_clima_laboral': new FormControl(),
				'b_capacitacion': new FormControl(),
				'b_control_doctos': new FormControl(),
				'b_salida_nc': new FormControl(),
				'b_queja': new FormControl(),
				'b_satisfaccion': new FormControl(),
				'b_indicador': new FormControl(),
				'b_auditor': new FormControl(),
				'b_revision_dir': new FormControl(),
				'b_no_conformidad': new FormControl(),
				'b_mejora_continua': new FormControl()
			})},
			{ validators: [correoValidator, correo2Validator, correo3Validator] }
		);
	}

	ngOnDestroy() {
		// unsubscribe to ensure no memory leaks
		this.subscription.unsubscribe();
	}

	get area() {
		return this.formaUsuarios.get('area');
	}

	get puesto() {
		return this.formaUsuarios.get('puesto');
	}

	get tipo() {
		return this.formaUsuarios.get('tipo');
	}

	getAreas() {
		this.subscription = this._areas.getAreas()
			.subscribe((data: any) => {
					this.areas = data.areas;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	getPuestos() {
		this.subscription = this._puestos.getPuestos()
			.subscribe((data: any) => {
					this.puestos = data.puestos;
					this._acceso.guardarStorage(data.token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	cargarUsuario(idUsuario: string) {
		let bandera = false;
		this.subscription = this._usuario.getUsuarioById(idUsuario)
			.subscribe(
				(data: any) => {
					this.usuario = data.usuario;
					this.banderasMatriz(this.usuario);
					this.formaUsuarios.patchValue(this.usuario);
					const token: string = data.token;
					this._acceso.guardarStorage(token);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
					bandera = false;
				});
		return bandera;
	}

	banderasMatriz(usuario: Usuario) {
		usuario.matriz.b_contexto = (usuario.matriz.contexto === 'S' ? true : null);
		usuario.matriz.b_liderazgo = (usuario.matriz.liderazgo === 'S' ? true : null);
		usuario.matriz.b_riesgo = (usuario.matriz.riesgo === 'S' ? true : null);
		usuario.matriz.b_oportunidad = (usuario.matriz.oportunidad === 'S' ? true : null);
		usuario.matriz.b_infraestruc = (usuario.matriz.infraestruc === 'S' ? true : null);
		usuario.matriz.b_clima_laboral = (usuario.matriz.clima_laboral === 'S' ? true : null);
		usuario.matriz.b_capacitacion = (usuario.matriz.capacitacion === 'S' ? true : null);
		usuario.matriz.b_control_doctos = (usuario.matriz.control_doctos === 'S' ? true : null);
		usuario.matriz.b_salida_nc = (usuario.matriz.salida_nc === 'S' ? true : null);
		usuario.matriz.b_queja = (usuario.matriz.queja === 'S' ? true : null);
		usuario.matriz.b_satisfaccion = (usuario.matriz.satisfaccion === 'S' ? true : null);
		usuario.matriz.b_indicador = (usuario.matriz.indicador === 'S' ? true : null);
		usuario.matriz.b_auditor = (usuario.matriz.auditor === 'S' ? true : null);
		usuario.matriz.b_revision_dir = (usuario.matriz.revision_dir === 'S' ? true : null);
		usuario.matriz.b_no_conformidad = (usuario.matriz.no_conformidad === 'S' ? true : null);
		usuario.matriz.b_mejora_continua = (usuario.matriz.mejora_continua === 'S' ? true : null);
	}

	guardar() {
		if (this.accion === 'U') {
			this.subscription = this._usuario.editarUsuario(this.formaUsuarios.value)
				.subscribe((data: any) => {
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'submenuusu', 'usuarios']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
		} else {
			this.subscription = this._usuario.insertarUsuario(this.formaUsuarios.value)
				.subscribe((data: any) => {
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/administracion', 'submenuusu', 'usuarios']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
		}
	}

	async cambiaPassADM() {
		// Primero se solicita la contraseña del administrador (por cuestiones de seguridad)
		const {value: formValuesADM} = await swal({
			title: 'Actualización de Contraseña',
			html:
				'<label for="input1ADM">Contraseña del Administrador</label>' +
				'<input id="input1ADM" class="swal2-input" type="password" autocomplete="off">',
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				return [
					(<HTMLInputElement>document.getElementById('input1ADM')).value
				];
			}
		});
		if (formValuesADM) {
			console.log(formValuesADM[0]);
			this._usuario.validarPassword(this._acceso.getUsername(), formValuesADM[0])
				.subscribe(
					(data: any) => {
						localStorage.setItem('token', data.token);
						if (data.valido) {
							this.cambiaPassUSR();
						} else {
							swal('ERROR', 'La contraseña del administrador es INCORRECTA', 'error');
						}
					},
					error => {
						console.log(error);
						swal('ERROR', error.error.message, 'error');
						if (error.error.code === 401) {
							this._acceso.logout();
						}
					}
				);
		}
	}

	async cambiaPassUSR() {
		// Una vez confirmada la contraseña del administrador, se solicita la contraseña nueva
		// del usuario y su confirmación
		const {value: formValuesUSR} = await swal({
			title: 'Actualización de Contraseña',
			html:
				'<label for="input1USR">Contraseña Nueva del Usuario</label>' +
				'<input id="input1USR" class="swal2-input" type="password" autocomplete="off">' +
				'<label for="input2USR">Confirmar Contraseña Nueva del Usuario</label>' +
				'<input id="input2USR" class="swal2-input" type="password" autocomplete="off">',
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				return [
					(<HTMLInputElement>document.getElementById('input1USR')).value,
					(<HTMLInputElement>document.getElementById('input2USR')).value
				];
			}
		});
		if (formValuesUSR) {
			if (formValuesUSR[0] !== formValuesUSR[1]) {
				swal('Atención!', 'La contraseña nueva y su confirmación no coinciden', 'error');
			} else {
				this._usuario.actualizarPassword(this.usuario.username, formValuesUSR[0])
					.subscribe(
						(data: any) => {
							localStorage.setItem('token', data.token);
							swal('Atención!!!', 'Contraseña Actualizada con Éxito!!!', 'success');
						},
						error => {
							swal('ERROR', error.error.message, 'error');
								if (error.error.code === 401) {
									this._acceso.logout();
								}
						}
					);
			}
		}
	}

}
