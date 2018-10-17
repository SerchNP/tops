export interface Areas {
	area: number;
	area_desc: string;
	predecesor?: string;
	predecesor_desc?: string;
	tipo: string;
	tipo_desc: string;
	autoriza: number;
	autoriza_desc: string;
	ent_data: string;
	f_captura: Date;
	u_captura: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancela?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
}
