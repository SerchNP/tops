import { NgModule } from '@angular/core';

import { GroupByPipe } from '../pipes/group-by.pipe';
import { FiltraObjetivoPipe } from '../pipes/filtra-objetivo.pipe';
import { FiltraProcesosPipe } from '../pipes/filtra-procesos.pipe';
import { FiltraColumnsPipe } from '../pipes/filtra-columns.pipe';
import { FiltraFodaPipe } from '../pipes/filtra-foda.pipe';
import { FiltraFodaAutPipe } from './filtra-foda.pipe';
import { FiltraTipoEstrategiaPipe } from '../pipes/filtra-tipo-estrategia.pipe';
import { FiltraClavePipe } from '../pipes/filtra-clave.pipe';

@NgModule ({
	declarations: [
		GroupByPipe,
		FiltraObjetivoPipe,
		FiltraProcesosPipe,
		FiltraColumnsPipe,
		FiltraFodaPipe,
		FiltraFodaAutPipe,
		FiltraTipoEstrategiaPipe,
		FiltraClavePipe
	],
	imports: [
	],
	exports: [
		GroupByPipe,
		FiltraObjetivoPipe,
		FiltraProcesosPipe,
		FiltraColumnsPipe,
		FiltraFodaPipe,
		FiltraTipoEstrategiaPipe,
		FiltraClavePipe
	]
})

export class PipesModule { }
