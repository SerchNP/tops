import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
	title: string;
	subtitle?: string;
	estatus: string;
	u_captura?: string;
	f_captura?: string;
	u_modifica?: string;
	f_modifica?: string;
	u_cancela?: string;
	f_cancela?: string;
	motivo_cancela?: string;
	u_rechaza?: string;
	f_rechaza?: string;
	motivo_rechaza?: string;
}

@Component({
	selector: 'app-dialog-detalle',
	templateUrl: './dialog-detalle.component.html',
	styleUrls: [ './dialog-detalle.component.scss']
})
export class DialogDetalleComponent {

	constructor(public dialogRef: MatDialogRef<DialogDetalleComponent>,
				@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

	onNoClick(): void {
		this.dialogRef.close();
	}
}
