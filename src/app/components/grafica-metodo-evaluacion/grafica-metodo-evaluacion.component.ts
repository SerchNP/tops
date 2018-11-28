import { Component } from '@angular/core';

@Component({
	selector: 'app-grafica-metodo-evaluacion',
	templateUrl: './grafica-metodo-evaluacion.component.html',
	styleUrls: ['./grafica-metodo-evaluacion.component.scss']
})

export class GraficaMetodoEvaluacionComponent {

	public barChartOptions: any = {
		scaleShowVerticalLines: true,
		responsive: true,
		// thickness: 'flex',
		title: {
			text: 'IMPACTO',
			display: true
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
				}
			}]
		}
	};
	public barChartLabels: string[] = ['1', '2', '3', '4', '5'];
	public barChartType = 'bar';
	public barChartLegend = false;

	public barChartColors: Array<any> = [
		{backgroundColor: '#1E9224'},
		{backgroundColor: '#00B0F0'},
		{backgroundColor: '#FFFF00'},
		{backgroundColor: '#FFC000'},
		{backgroundColor: '#FF0000'},
	];


	public barChartData: any[] = [
		{data: [40, 20, 0, 0, 0], label: 'TOLERABLE', stack: 'Stack 0'},
		{data: [60, 40, 40, 20, 20], label: 'BAJO', stack: 'Stack 0'},
		{data: [0, 40, 20, 20, 20], label: 'MEDIO', stack: 'Stack 0'},
		{data: [0, 0, 40, 40, 20], label: 'ALTO', stack: 'Stack 0'},
		{data: [0, 0, 0, 20, 40], label: 'CRÍTICO', stack: 'Stack 0'}
	];

	// events
	public chartClicked(e: any): void {
		console.log(e);
	}

	public chartHovered(e: any): void {
		console.log(e);
	}

}
