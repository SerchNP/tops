import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccesoService, MetodoEvaluacionService } from '../../services/services.index';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
	selector: 'app-grafica-metodo-evaluacion',
	templateUrl: './grafica-metodo-evaluacion.component.html',
	styleUrls: ['./grafica-metodo-evaluacion.component.scss']
})

export class GraficaMetodoEvaluacionComponent implements OnInit, OnDestroy {

	private subscription: Subscription;

	cargando = false;

	public barChartOptions: any = {
		scaleShowVerticalLines: true,
		responsive: true,
		// thickness: 'flex',
		title: {
			text: 'IMPACTO',
			fontSize: 14,
			display: true
		},
		tooltips: {
			mode: 'nearest',
			intersect: false
		},
		scales: {
			xAxes: [{
				barPercentage: 1.0,
				categoryPercentage: 1.0
				/*ticks:{
				beginAtZero:true
			  }*/
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'FRECUENCIA (HISTÓRICA) PROBABILIDAD (%)'
				},
				ticks: {
					stepSize: 20
				}
			}]
		}
	};
	public barChartLabels: string[] = ['1', '2', '3', '4', '5'];
	public barChartType = 'bar';
	public barChartLegend = false;
	public barChartColors: Array<any> = [];
	public barChartData: Array<any> = [];
	/*[
		{data: [40, 20, 0, 0, 0], label: 'TOLERABLE', stack: 'Stack 0'},
		{data: [60, 40, 40, 20, 20], label: 'BAJO', stack: 'Stack 0'},
		{data: [0, 40, 20, 20, 20], label: 'MEDIO', stack: 'Stack 0'},
		{data: [0, 0, 40, 40, 20], label: 'ALTO', stack: 'Stack 0'},
		{data: [0, 0, 0, 20, 40], label: 'CRÍTICO', stack: 'Stack 0'}
	];*/

	// events
	public chartClicked(e: any): void {
		console.log(e);
	}

	public chartHovered(e: any): void {
		console.log(e);
	}

	constructor (private _acceso: AccesoService,
				private _mevaluacion: MetodoEvaluacionService) { }

	ngOnInit() {
		this.cargando = true;
		this.subscription = this._mevaluacion.getColoresGrafica()
			.subscribe(
				(data: any) => {
					const colores: any[] = [];
					data.colores.forEach(element => colores.push({backgroundColor: element.color}));
					this.barChartColors = colores;
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});

		this.cargando = true;
		this.subscription = this._mevaluacion.getDatosGrafica()
			.subscribe(
				(data: any) => {
					const datos: any[] = [];
					data.datosg.forEach(g => {
						const valores: any[] = [];
						valores.push((g.d1 === undefined ? 0 : (g.d1 * 20)));
						valores.push((g.d2 === undefined ? 0 : (g.d2 * 20)));
						valores.push((g.d3 === undefined ? 0 : (g.d3 * 20)));
						valores.push((g.d4 === undefined ? 0 : (g.d4 * 20)));
						valores.push((g.d5 === undefined ? 0 : (g.d5 * 20)));

						datos.push({stack: 'Stack 0', label: g.descrip, data: valores});
					});
					this.barChartData = datos;
					this._acceso.guardarStorage(data.token);
					this.cargando = false;
				},
				error => {
					swal('ERROR', error.error.message, 'error');
					if (error.error.code === 401) {
						this._acceso.logout();
					}
				});

	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
