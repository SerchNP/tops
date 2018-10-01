export class FodaC {
	proceso: number;
	proceso_desc: string;
	foda: number;
	foda_desc: string;
	orden: number;
	cuestion: string;
	cuestion_desc: string;
	tipo_cuestion: string;
	tipo_cuestion_desc: string;
	autoriza: number;
	autoriza_desc: string;
	estatus: string;
	estatus_desc: string;
	f_captura: Date;
	u_captura: string;
	f_propuesta: Date;
	u_propuesta: string;
	f_preautoriza?: Date;
	u_preautoriza?: string;
	f_autoriza?: Date;
	u_autoriza?: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancela?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
	f_rechaza?: Date;
	u_rechaza?: string;
	motivo_rechaza?: string;
}
