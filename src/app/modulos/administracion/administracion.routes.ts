import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from '../../pages/pages.component';

// Guards
import { LoginGuard, TipoUsuarioGuard } from '../../services/services.index';

// Catálogos
import { FrecuenciasMedicionComponent } from './catalogos/frecuencias-medicion.component';
import { FrecuenciasMedicionFormularioComponent } from './catalogos/frecuencias-medicion-formulario.component';
import { FormulasComponent } from './catalogos/formulas.component';
import { FormulasFormularioComponent } from './catalogos/formulas-formulario.component';
import { TResultadosComponent } from './catalogos/tresultados.component';
import { TresultadosFormularioComponent } from './catalogos/tresultados-formulario.component';
import { PeriodosComponent } from './catalogos/periodos.component';
import { PeriodosFormularioComponent } from './catalogos/periodos-formulario.component';
import { AccionesComponent } from './catalogos/acciones.component';
import { CuestionesComponent } from './catalogos/cuestiones.component';
import { EdosRiesgoComponent } from './catalogos/edos-riesgo.component';
import { EstrategiasComponent } from './catalogos/estrategias.component';
import { ImpactoComponent } from './catalogos/impacto.component';
import { NivelRiesgoComponent } from './catalogos/nivel-riesgo.component';
import { OcurrenciaComponent } from './catalogos/ocurrencia.component';

// Areas
import { AreasComponent } from './areas/areas.component';
import { AreasFormularioComponent } from './areas/areas-formulario.component';

// Procesos
import { ProcesosComponent } from './procesos/procesos.component';
import { ProcesosFormularioComponent } from './procesos/procesos-formulario.component';
import { AreaProcesoFormularioComponent } from './area-proceso/area-proceso-formulario.component';
import { AreaProcesoComponent } from './area-proceso/area-proceso.component';

// Puestos
import { PuestosComponent } from './puestos/puestos.component';
import { PuestosFormularioComponent } from './puestos/puestos-formulario.component';

// Usuarios
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosFormularioComponent } from './usuarios/usuarios-formulario.component';
import { UsuarioProcesoComponent } from './usuario-proceso/usuario-proceso.component';
import { UsuarioProcesoFormularioComponent } from './usuario-proceso/usuario-proceso-formulario.component';

// Identidad
import { IdentidadComponent } from './identidad/identidad.component';
import { IdentidadFormularioComponent } from './identidad/identidad-formulario.component';

// Archivos
import { ArchivoGeneraComponent } from './archivos/archivo-genera.component';
import { ArchivoVisuaizarComponent } from './archivos/archivo-visuaizar.component';

const administracionRoutes: Routes = [
	{
		path: 'administracion',
		component: PagesComponent,
		canActivate: [LoginGuard, TipoUsuarioGuard],
		children: [
			{
				path: 'submenucat',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'frecuencias', component: FrecuenciasMedicionComponent, data: {titulo: 'Catálogo de Frecuencias de Medición', padre: 'Administración', opcion: 'Frecuencias de Medición'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'frecuencias_form/:acc/:id', component: FrecuenciasMedicionFormularioComponent, data: {titulo: 'Mantenimiento de Frecuencias de Medición', padre: 'Administración', opcion: 'Frecuencias de Medición'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'formulas', component: FormulasComponent, data: {titulo: 'Catálogo de Fórmulas', padre: 'Administración', opcion: 'Fórmulas'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'formulas_form/:acc/:id', component: FormulasFormularioComponent, data: {titulo: 'Mantenimiento de Fórmulas', padre: 'Administración', opcion: 'Fórmulas'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'tresultados', component: TResultadosComponent, data: {titulo: 'Catálogo de Tipo de Resultados', padre: 'Administración', opcion: 'Tipo de Resultados'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'tresultados_form/:acc/:id', component: TresultadosFormularioComponent, data: {titulo: 'Mantenimiento de Tipo de Resultados', padre: 'Administración', opcion: 'Tipo de Resultados'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'periodos', component: PeriodosComponent, data: {titulo: 'Catálogo de Periodos', padre: 'Administración', opcion: 'Periodos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'periodos_form', component: PeriodosFormularioComponent, data: {titulo: 'Alta de Periodos', padre: 'Administración', opcion: 'Periodos'} },
					// tslint:disable-next-line:max-line-length
					// { path: 'acciones', component: AccionesComponent, data: {titulo: 'Catálogo de Acciones a Tomar', padre: 'Administración', opcion: 'Acciones'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'cuestiones', component: CuestionesComponent, data: {titulo: 'Catálogo de Cuestiones para FODA', padre: 'Administración', opcion: 'Cuestiones'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'edos_riesgo', component: EdosRiesgoComponent, data: {titulo: 'Catálogo de Estados de Riesgos', padre: 'Administración', opcion: 'Estados de Riesgos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'estrategias', component: EstrategiasComponent, data: {titulo: 'Catálogo de Estrategias', padre: 'Administración', opcion: 'Etrategias'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'impacto', component: ImpactoComponent, data: {titulo: 'Catálogo de Nivel de Impacto', padre: 'Administración', opcion: 'Nivel de Impacto del Riesgo'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'nivel_riesgo', component: NivelRiesgoComponent, data: {titulo: 'Catálogo de Nivel de Riesgos', padre: 'Administración', opcion: 'Nivel del Riesgo'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'ocurrencia', component: OcurrenciaComponent, data: {titulo: 'Catálogo de Ocurrencia del Riesgo', padre: 'Administración', opcion: 'Ocurrencia del Riesgo'} },
				]
			},
			{ path: 'areas', component: AreasComponent, data: {titulo: 'Catálogo de Áreas', padre: 'Administración', opcion: 'Áreas'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'areas_form/:acc/:id', component: AreasFormularioComponent, data: {titulo: 'Mantenimiento de Áreas', padre: 'Administración', opcion: 'Áreas'} },
			{
				path: 'submenuproc',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'procesos', component: ProcesosComponent, data: {titulo: 'Catálogo de Procesos', padre: 'Administración', opcion: 'Procesos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'procesos_form/:acc/:id', component: ProcesosFormularioComponent, data: {titulo: 'Mantenimiento de Procesos', padre: 'Administración', opcion: 'Procesos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'area_proceso', component: AreaProcesoComponent, data: {titulo: 'Asignar Área(s) a Proceso', padre: 'Administración', opcion: 'Procesos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'area_proceso_form/:acc/:id', component: AreaProcesoFormularioComponent, data: {titulo: 'Asignación de Áreas a Procesos', padre: 'Administración', opcion: 'Procesos'} }
				]
			},
			{ path: 'puestos', component: PuestosComponent, data: {titulo: 'Catálogo de Puestos', padre: 'Administración', opcion: 'Puestos'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'puestos_form/:acc/:id', component: PuestosFormularioComponent, data: {titulo: 'Mantenimiento de Puestos', padre: 'Administración', opcion: 'Puestos'} },
			{
				path: 'submenuusu',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Catálogo de Usuarios', padre: 'Administración', opcion: 'Usuarios'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'usuarios_form/:acc/:id', component: UsuariosFormularioComponent, data: {titulo: 'Mantenimiento de Usuarios', padre: 'Administración', opcion: 'Usuarios'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'usuario_proceso', component: UsuarioProcesoComponent, data: {titulo: 'Asignar Privilegios a Usuarios', padre: 'Administración', opcion: 'Procesos a Usuarios'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'userproc_form/:acc/:user/:proc', component: UsuarioProcesoFormularioComponent, data: {titulo: 'Asignación de Privilegios a Usuarios', padre: 'Administración', opcion: 'Procesos a Usuarios'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'userproc_form/:acc', component: UsuarioProcesoFormularioComponent, data: {titulo: 'Asignación de Privilegios a Usuarios', padre: 'Administración', opcion: 'Procesos a Usuarios'} }
				]
			},
			{
				path: 'submenuident',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_p', component: IdentidadComponent, data: {titulo: 'Catálogo de Política de Calidad', padre: 'Administración', opcion: 'Política de Calidad'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_a', component: IdentidadComponent, data: {titulo: 'Catálogo de Alcances', padre: 'Administración', opcion: 'Alcance'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_m', component: IdentidadComponent, data: {titulo: 'Catálogo de Misión', padre: 'Administración', opcion: 'Misión'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_v', component: IdentidadComponent, data: {titulo: 'Catálogo de Visión', padre: 'Administración', opcion: 'Visión'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_o', component: IdentidadComponent, data: {titulo: 'Catálogo de Objetivos de Calidad', padre: 'Administración', opcion: 'Objetivos de Calidad'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_n', component: IdentidadComponent, data: {titulo: 'Catálogo de Notas', padre: 'Administración', opcion: 'Notas'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'identidad_form/:tipo/:acc/:id', component: IdentidadFormularioComponent, data: {titulo: 'Mantenimiento de Catálogos de Identidad', padre: 'Administración', opcion: 'Identidad'} }
				]
			},
			// tslint:disable-next-line:max-line-length
			{ path: 'identidad_e', component: IdentidadComponent, data: {titulo: 'Catálogo de Ejes Estratégicos', padre: 'Administración', opcion: 'Ejes Estratégicos'} },
			// tslint:disable-next-line:max-line-length
			{ path: 'ejes_form/:tipo/:acc/:id', component: IdentidadFormularioComponent, data: {titulo: 'Mantenimiento de Ejes Estratégicos', padre: 'Administración', opcion: 'Ejes Estratégicos'} },
			{
				path: 'archivos',
				children: [
					// tslint:disable-next-line:max-line-length
					{ path: 'archivo_genera', component: ArchivoGeneraComponent, data: {titulo: 'Generación de Archivos', padre: 'Administración', opcion: 'Archivos'} },
					// tslint:disable-next-line:max-line-length
					{ path: 'archivo_visualizar', component: ArchivoVisuaizarComponent, data: {titulo: 'Visualización de Archivos', padre: 'Administración', opcion: 'Archivos'} }
				]
			},
		]
	}
];

export const ADMINISTRACION_ROUTES = RouterModule.forChild(administracionRoutes);
