import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService, AccesoService } from '../../services/services.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableComponent } from '../../components/data-table/data-table.component';

@Component({
	selector: 'app-usuarios',
	templateUrl: './usuarios.component.html',
	styles: []
})
export class UsuariosComponent implements OnInit {

	@ViewChild('dtusuarios') dataTable: DataTableComponent;

	jsonData: any;
	data: any[] = [];
	cargando = false;
	llave = 'usuario';

	columns: Array<any> = [
		{title: 'Usuario', name: 'usuario', columnName: 'usuario',
			filtering: {filterString: '', placeholder: 'Usuario'}},
		{title: 'Nombre', name: 'nombre', sort: 'asc', columnName: 'nombre',
			filtering: {filterString: '', placeholder: 'Nombre'}},
		{title: 'Paterno', name: 'paterno', sort: 'asc', columnName: 'paterno',
			filtering: {filterString: '', placeholder: 'Paterno'}},
		{title: 'Materno', name: 'materno', sort: 'asc', columnName: 'materno',
			filtering: {filterString: '', placeholder: 'Materno'}},
		{title: 'E-mail', name: 'email', columnName: 'email'},
		{title: 'E-mail Adicional', name: 'email2', columnName: 'email2'},
		{title: 'Área', name: 'area_desc', columnName: 'area_desc',
			filtering: {filterString: '', placeholder: 'Área'}},
		{title: 'Puesto', name: 'puesto_desc', columnName: 'puesto_desc',
			filtering: {filterString: '', placeholder: 'Puesto'}},
		{title: 'Tipo', name: 'tipo_desc', columnName: 'tipo_desc',
			filtering: {filterString: '', placeholder: 'Tipo'}},
		{title: 'Situación', name: 'estatus_desc', columnName: 'estatus_desc',
			filtering: {filterString: '', placeholder: 'Situación'}}
	];

	constructor(public _usuarioService: UsuarioService, public _accesoService: AccesoService, private router: Router) { }

	ngOnInit() {
		this.cargando = true;
		this._usuarioService.getUsuarios()
			.subscribe(
				data => {
					this.jsonData = data;
					this.data = this.jsonData.usuarios;
					this._accesoService.guardarStorage(this.jsonData.token);

					this.dataTable.columns = this.columns;
					this.dataTable.data = this.data;
					this.dataTable.length = this.jsonData.usuarios.length;
					this.dataTable.config.sorting.columns = this.columns;
					this.dataTable.insertar = true;
					this.dataTable.ruta_add = ['/paneladm', 'submenuusu', 'usuarios_form', 'I', 0];
					this.dataTable.editar = true;
					this.dataTable.cancelar = true;
					this.dataTable.onChangeTable(this.dataTable.config);

					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._accesoService.logout();
					}
				});
	}

	detectarAccion(accion: any): void {
		if (accion.column === 'action_e') {
			this.editarUsuario(accion.row);
		} else if (accion.column === 'action_c') {
			this.cancelarUsuario(accion.row);
		} else {
			// console.log('Columna no botón');
		}
	}

	editarUsuario(usuario: any) {
		if (usuario.estatus === 'C') {
			swal('ERROR', 'El usuario se puede editar porque está cancelado', 'error');
		} else {
			this.router.navigate(['/paneladm', 'submenuusu', 'usuarios_form', 'U', usuario.usuario]);
		}
	}

	cancelarUsuario(usuario: any) {
		console.log(usuario);
	}

}
