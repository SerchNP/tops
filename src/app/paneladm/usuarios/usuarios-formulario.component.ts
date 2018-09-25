import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AccesoService, UsuarioService, AreasService, PuestosService } from '../../services/services.index';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Usuario } from '../../interfaces/usuarios.interface';
import { correoValidator, correo2Validator, correo3Validator } from './correo-validator.directive';

@Component({
	selector: 'app-usuarios-formulario',
	templateUrl: './usuarios-formulario.component.html',
	styleUrls: ['./usuarios.component.css']
})

export class UsuariosFormularioComponent implements OnInit {

	private sub: any;
	accion: string;
	idUsuario: string;
	titulo: string;

	formaUsuarios: FormGroup;
	areas: any[] = [];
	puestos: any[] = [];
	usuario: Usuario;

	constructor(private router: Router, private activated: ActivatedRoute, public _accesoService: AccesoService,
				private _usuario: UsuarioService, private _areas: AreasService, private _puestos: PuestosService) {
		this.sub = this.activated.params.subscribe(params => {
			this.accion = params['acc'];
			this.idUsuario = params['id'];
		});

		this.titulo = (this.accion === 'I' ? 'Registro de Usuarios' : 'Actualización de Usuarios');

		if (this.accion === 'U') {
			this.cargarUsuario(this.idUsuario);
		}
	}

	ngOnInit() {
		this.getAreas();
		this.getPuestos();
		this.formaUsuarios = new FormGroup({
			'usuario': new FormGroup({
				// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
				'username' : new FormControl('', Validators.required),
				'titulo': new FormControl('C.', Validators.required),
				'nombre' : new FormControl('', Validators.required),
				'paterno' : new FormControl('', Validators.required),
				'materno' : new FormControl(),
				'email': new FormControl(''),
				'email2': new FormControl(''),
				'email3': new FormControl(''),
				'area' : new FormControl('', Validators.required),
				'puesto' : new FormControl('', Validators.required),
				'tipo' : new FormControl('', Validators.required)
			}, { validators: [correoValidator, correo2Validator, correo3Validator] }),
			'matriz': new FormGroup({
				'contexto': new FormControl(),
				'liderazgo': new FormControl(),
				'riesgo': new FormControl(),
				'oportunidad': new FormControl(),
				'infraestructura': new FormControl(),
				'clima': new FormControl(),
				'capacitacion': new FormControl(),
				'control': new FormControl(),
				'salidanc': new FormControl(),
				'quejas': new FormControl(),
				'satisfaccion': new FormControl(),
				'indicadores': new FormControl(),
				'auditor': new FormControl(),
				'revision': new FormControl(),
				'noconf': new FormControl(),
				'mejora': new FormControl()
			})
		});
	}

	get area() {
		return this.formaUsuarios.get('usuario.area');
	}

	get puesto() {
		return this.formaUsuarios.get('usuario.puesto');
	}

	get tipo() {
		return this.formaUsuarios.get('usuario.tipo');
	}

	cancelar() {
		this.router.navigate(['/paneladm', 'submenuusu', 'usuarios']);
	}

	getAreas() {
		this._areas.getAreasTree()
			.subscribe(
				data => {
					this.areas = data;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	getPuestos() {
		this._puestos.getPuestosTree()
			.subscribe(
				data => {
					this.puestos = data;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	cargarUsuario(idUsuario: string) {
		let bandera = false;
		this._usuario.getUsuarioById(idUsuario)
			.subscribe(
				(data: any) => {
					console.log(data.usuario);
					this.usuario = data.usuario;
					this.formaUsuarios.patchValue(this.usuario);
					const token: string = data.token;
					this._accesoService.guardarStorage(token);
				},
				error => {
					console.error(error);
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
					bandera = false;
				});
		return bandera;
	}

	guardar() {
		if (this.accion === 'U') {
			console.log(this.formaUsuarios.value);
			this._usuario.editarUsuario(this.formaUsuarios.value)
				.subscribe((data: any) => {
					console.log(data);
					// this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/paneladm', 'submenuusu', 'usuarios']);
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		} else {
			console.log(this.formaUsuarios.get('usuario').value);
			console.log(this.formaUsuarios.get('matriz').value);
			this._usuario.insertarUsuario(this.formaUsuarios.get('usuario').value, this.formaUsuarios.get('matriz').value)
				.subscribe((data: any) => {
					// this._accesoService.guardarStorage(data.token);
					swal('Atención!!!', data.message, 'success');
					this.router.navigate(['/paneladm', 'submenuusu', 'usuarios']);
				},
				error => {
					console.error(error);
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
		}
	}

}
