import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProcesosService, UsersService } from '../../services/services.index';
import { Proceso } from '../../models/proceso.model';

@Component({
	selector: 'app-procesos-formulario',
	templateUrl: './procesos-formulario.component.html'
})

export class ProcesosFormularioComponent implements OnInit, OnDestroy {

	private sub: any;
	accion: string;
	idProceso: number;
	titulo: string;

	resultado: any;
	oProceso: Proceso;
	/*proc: Proceso = {
		this.proceso : 0,
		this.pred : 0,
		this.descrip = '',
		this.estatus = 'A',
		this.ent_data = 'N'
	};*/

	forma: FormGroup;


	nodes = [
		{
		  id: 1,
		  name: 'root1',
		  children: [
			{ id: 2, name: 'child1' },
			{ id: 3, name: 'child2' }
		  ]
		},
		{
		  id: 4,
		  name: 'root2',
		  children: [
			{ id: 5, name: 'child2.1' },
			{
			  id: 6,
			  name: 'child2.2',
			  children: [
				{ id: 7, name: 'subsub' }
			  ]
			}
		  ]
		}
	  ];
	  options = {};


	cargarProceso(idProceso): boolean {
		let bandera = false;
		this._procesosService.getProcesoById(idProceso)
			.subscribe(
				data => {
					this.resultado = data;
					this.oProceso = this.resultado.proceso;
					bandera = true;
					console.log(this.oProceso);
				},
				error => {
					console.error(error);
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._usersService.logout();
					}
					bandera = false;
				});
		return bandera;
	}



	constructor(private route: ActivatedRoute, private _usersService: UsersService, private _procesosService: ProcesosService) {
		this.sub = this.route.params.subscribe(params => {
			this.accion = params['acc'];
			this.idProceso = params['id'];
		});

		this.titulo = (this.accion === 'I' ? 'Registro de Procesos' : 'Actualización de Procesos');

		if (this.accion === 'I') {
			this.oProceso = new Proceso(null, null, '', null, 'A', 'N');
		} else {
			this.cargarProceso(this.idProceso);
			console.log(this.oProceso);
		}
	}

	ngOnInit() {
		this.forma = new FormGroup({
			// FormControl ---> Valor default, Reglas de Validacion, Reglas de validación asíncronas
			'proceso' : new FormControl('',
										[
											Validators.required,
											Validators.minLength(1),
											Validators.maxLength(10),
											Validators.pattern('[0-9]{1,10}')
										]
									),

			'predecesor' : new FormControl('',
				Validators.required
				),/*this.proceso.pred,
			 						// tslint:disable-next-line:indent
			 						[
										Validators.required,
										// Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
										Validators.pattern('([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+\.+([a-z0-9]{2,4})+$')
										// Validators.email
									]),*/
			'descripcion' : new FormControl('',
											Validators.required
											),
			'ent_data' : new FormControl('',
										Validators.required
										)
		});
		console.log(this.oProceso);
		this.forma.setValue(this.oProceso);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	guardar() {
		console.log(this.forma.value);
		console.log(this.forma.valid);
		console.log(this.forma);
	}

}
