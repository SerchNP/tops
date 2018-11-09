import { NgModule } from '@angular/core';

import { GroupByPipe } from '../pipes/group-by.pipe';
import { FiltraObjetivoPipe } from '../pipes/filtra-objetivo.pipe';
import { FiltraProcesosPipe } from '../pipes/filtra-procesos.pipe';
import { FiltraColumnsPipe } from '../pipes/filtra-columns.pipe';
import { FiltraFodaPipe } from '../pipes//filtra-foda.pipe';

@NgModule ({
	declarations: [
		GroupByPipe,
		FiltraObjetivoPipe,
		FiltraProcesosPipe,
		FiltraColumnsPipe,
		FiltraFodaPipe
	],
	imports: [
	],
	exports: [
		GroupByPipe,
		FiltraObjetivoPipe,
		FiltraProcesosPipe,
		FiltraColumnsPipe,
		FiltraFodaPipe
	]
})

export class PipesModule { }
