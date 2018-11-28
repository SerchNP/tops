export interface Riesgo {
	riesgo?: number;
	riesgo_desc?:	string;
	predecesor?: number;
	proceso?: number;
	proceso_desc?: string;
	cuestiones?: {
		proceso: number,
		foda: number
	};
	tipo_riesgo?: string;
	consecutivo?: string;
	origen?: string;
	easproc?: string;
	responsable?: string;
	puesto?: number;
	edo_riesgo?: string;
	causas?: {
		clave: number;
		descripcion: string;
	};
	consecuencias?: {
		clave: number;
		descripcion: string;
	};
	ent_data?: string;
	autoriza?: number;
	estatus?: string;
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
	motivo_modif?: string;
}
