export interface AreaProceso {
	clave: number;
	proceso: number;
	proceso_desc: string;
	area: number;
	area_desc: string;
	autoriza: number;
	autoriza_desc: string;
	f_captura: Date;
	u_captura: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancela?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
}
