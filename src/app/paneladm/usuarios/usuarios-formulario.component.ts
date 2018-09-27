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
	cancelar: any[] = ['/paneladm', 'submenuusu', 'usuarios'];

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
					this.usuario = data.usuario;
					this.banderasMatriz(this.usuario);
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
			this._usuario.editarUsuario(this.formaUsuarios.value)
				.subscribe((data: any) => {
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
			this._usuario.insertarUsuario(this.formaUsuarios.value)
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
