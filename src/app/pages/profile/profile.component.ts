import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService, AreasService, PuestosService, AccesoService } from '../../services/services.index';
import { correoValidator, correo2Validator, correo3Validator } from '../../directivas/correo-validator.directive';
import { Areas } from '../../interfaces/areas.interface';
import { Puestos } from '../../interfaces/puestos.interface';
import { Usuario } from '../../interfaces/usuarios.interface';
import swal from 'sweetalert2';


@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {

	formaProfile: FormGroup;
	listadoArea: Areas[];
	listadoPuesto: Puestos[];
	usuario: Usuario;
	banderaActualizar = false;

	constructor(private _usuario: UsuarioService, private _areas: AreasService, private _puestos: PuestosService,
				public _acceso: AccesoService) { }

	ngOnInit() {
		this.banderaActualizar = false;
		this.formaProfile = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'username' : new FormControl(),
			'titulo': new FormControl('', Validators.required),
			'nombre' : new FormControl('', Validators.required),
			'paterno' : new FormControl('', Validators.required),
			'materno' : new FormControl(),
			'email' : new FormControl(''),
			'email2' : new FormControl(''),
			'email3' : new FormControl(''),
			'area': new FormControl(),
			'puesto': new FormControl()
		}, { validators: [correoValidator, correo2Validator, correo3Validator] });
		this.cargarInfoUsuario();
	}

	cargarAreas(area: number) {
		this._areas.getAreaById(area)
			.subscribe(
				(data: any) => {
					localStorage.setItem('token', data.token);
					this.listadoArea = [data.area];
				}, error => {
					swal('ERROR', error.error.message, 'error');
				}
			);
	}

	cargarPuestos(puesto: number) {
		this._puestos.getPuestoById(puesto)
			.subscribe(
				(data: any) => {
					localStorage.setItem('token', data.token);
					this.listadoPuesto = [data.puesto];
				}, error => {
					swal('ERROR', error.error.message, 'error');
				}
			);
	}

	cargarInfoUsuario() {
		const token = localStorage.getItem('token');
		const payload = JSON.parse(atob(token.split('.')[1]));
		const usuario = JSON.parse(payload.usuario);
		this._usuario.getUsuarioById(usuario.username)
			.subscribe(
				(data: any) => {
					localStorage.setItem('token', data.token);
					this.usuario = data.usuario;
					this.formaProfile.patchValue(data.usuario);
					this.cargarAreas(this.usuario.area);
					this.cargarPuestos(this.usuario.puesto);
				},
				error => {
					swal('ERROR', 'Error al cargar el Profile del Usuario', 'error');
				});
	}

	async validarPass() {
		const {value: password} = await swal({
			title: 'Actualización de Contraseña (Validación)',
			text: 'Ingrese su contraseña Actual',
			input: 'password',
			inputPlaceholder: 'Contraseña Actual',
			inputAttributes: {
				autocapitalize: 'off',
				autocorrect: 'off'
			},
			inputValidator: (value) => {
				return !value && 'Necesita ingresar la contraseña actual';
			},
			showCancelButton: true,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#B22222'
		});
		if (password) {
			this._usuario.validarPassword(this._acceso.getUsername(), password)
				.subscribe(
					(data: any) => {
						// let bandera = data.valido;
						localStorage.setItem('token', data.token);
						if (!data.valido) {
							swal('Atención!', 'La contraseña ingresada no coincide', 'error');
						} else {
							this.actualizarPass();
						}
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

	async actualizarPass() {
		const {value: formValues} = await swal({
			title: 'Actualización de Contraseña',
			html:
				'<label for="input1">Contraseña Nueva</label>' +
				'<input id="input1" class="swal2-input" type="password">' +
				'<label for="input1">Confirmar Contraseña Nueva</label>' +
				'<input id="input2" class="swal2-input" type="password">',
			focusConfirm: false,
			preConfirm: () => {
				return [
					document.getElementById('input1').value,
					document.getElementById('input2').value
				];
			}
		});
		if (formValues) {
			if (formValues[0] !== formValues[1]) {
				swal('Atención!', 'La contraseña nueva y su confirmación no coinciden', 'error');
			} else {
				this._usuario.actualizarPassword(this._acceso.getUsername(), formValues[0])
				.subscribe(
					(data: any) => {
						localStorage.setItem('token', data.token);
						this.confirmarActualizacionPassword(data.message);
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

	async confirmarActualizacionPassword(mensaje: string) {
		const {value: boton} = await swal({
			title: 'Atención!',
			text: mensaje,
			type: 'success'});
		if (boton) {
			this._acceso.logout();
		}
	}

	guardarCambios() {
		this._usuario.actualizarPerfil(this.formaProfile.value)
				.subscribe((data: any) => {
					this.confirmarActualizacionPerfil(data.message);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});
	}

	async confirmarActualizacionPerfil(mensaje: string) {
		const {value: boton} = await swal({
			title: 'Atención!',
			text: mensaje,
			type: 'success'});
		if (boton) {
			this.ngOnInit();
		}
	}

}
