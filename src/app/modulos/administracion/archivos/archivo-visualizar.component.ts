import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-archivo-visualizar',
	templateUrl: './archivo-visualizar.component.html'
})

export class ArchivoVisualizarComponent implements OnInit {

	ruta: any;
	Url: SafeUrl;

	constructor(private sanitizer: DomSanitizer) { }

	ngOnInit() {
		this.Url = this.sanitizer.bypassSecurityTrustResourceUrl('http://sgc.ujed.mx/SGCRPT/TM201804/3005001/FODA_3005001.pdf');
		console.log(this.Url);
		this.ruta = {
			url : 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf', 
			// 'http://sgc.ujed.mx/SGCRPT/TM201804/3005001/FODA_3005001.pdf',
			/*withCredentials: true,
			header : {
				'Access-Control-Allow-Origin' : '*'
			}*/
			mode: 'no-cors'
		};
	}

	abrirFODA() {
		console.log('aqui');
		window.open('http://sgc.ujed.mx/SGCRPT/TM201804/3005001/FODA_3005001.pdf', '_blank');
	}

}
