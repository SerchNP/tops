export interface Puestos {
	puesto: number;
	puesto_desc: string;
	predecesor?: string;
	predecesor_desc?: string;
	activo: string;
	// activo_desc: string;
	f_captura: Date;
	u_captura: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancela?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
}
