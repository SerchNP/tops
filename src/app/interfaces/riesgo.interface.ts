export interface RiesgoGestion {
	riesgo?: number;
	riesgo_desc?:	string;
	proceso?: number;
	proceso_desc?: string;
	cuestiones?: {
		foda: number,
		foda_desc: string;
	};
	tipo_riesgo?: string;
	tipo_riesgo_desc?: string;
	consecutivo?: string;
	autoriza?: number;
	autoriza_desc?: string;
	estatus?: string;
	estatus_desc?: string;
	f_captura?: Date;
	u_captura?: string;
	f_propuesta?: Date;
	u_propuesta?: string;
	f_preautoriza?: Date;
	u_preautoriza?: string;
	f_autoriza?: Date;
	u_autoriza?: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancel?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
	f_rechaza?: Date;
	u_rechaza?: string;
	motivo_rechaza?: string;
	cancelado?: string;
}

export interface RiesgoOperativo {
	riesgo?: number;
	riesgo_desc?:	string;
	proceso?: number;
	proceso_desc?: string;
	cuestiones?: {
		foda: number,
		foda_desc: string;
	};
	tipo_riesgo?: string;
	tipo_riesgo_desc?: string;
	consecutivo?: string;
	origen?: string;
	origen_desc?: string;
	responsable?: string;
	edo_riesgo?: string;
	edo_riesgo_desc?: string;
	causas?: {
		causa: number;
		causa_desc: string;
	};
	consecuencias?: {
		consecuencia: number;
		consecuencia_desc: string;
	};
	autoriza?: number;
	autoriza_desc?: string;
	estatus?: string;
	estatus_desc?: string;
	f_captura?: Date;
	u_captura?: string;
	f_propuesta?: Date;
	u_propuesta?: string;
	f_preautoriza?: Date;
	u_preautoriza?: string;
	f_autoriza?: Date;
	u_autoriza?: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancel?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
	f_rechaza?: Date;
	u_rechaza?: string;
	motivo_rechaza?: string;
	cancelado?: string;
}
