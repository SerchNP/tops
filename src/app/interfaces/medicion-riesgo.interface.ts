export interface MedicionRiesgo {
	regid?: number;
	riesgo?: number;
	riesgo_desc?: string;
	predecesor?: number;
	ocurrencia?: number;
	valorc_o?: number;
	impacto?: number;
	valorc_i?: number;
	valorc_t?: number;
	nivel?: number;
	nivel_desc?: string;
	autoriza?: number;
	estatus?: string;
	f_captura?: Date;
	u_captura?: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancel?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
	cancelado?: string;
}
