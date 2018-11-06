import { NgModule } from '@angular/core';

import { GroupByPipe } from '../pipes/group-by.pipe';
import { FiltraObjetivoPipe } from '../pipes/filtra-objetivo.pipe';
import { FiltraProcesosPipe } from '../pipes/filtra-procesos.pipe';
import { FiltraColumnsPipe } from '../pipes/filtra-columns.pipe';

@NgModule ({
	declarations: [
		GroupByPipe,
		FiltraObjetivoPipe,
		FiltraProcesosPipe,
		FiltraColumnsPipe
	],
	imports: [
	],
	exports: [
		GroupByPipe,
		FiltraObjetivoPipe,
		FiltraProcesosPipe,
		FiltraColumnsPipe
	]
})

export class PipesModule { }
