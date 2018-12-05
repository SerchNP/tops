export interface Accion {
	proceso: number;
	regid: number;
	accion_desc: string;
	origen?: string; // DE, RI, OP
	origen_id: string; // ID Dir. Estrateg., Riesgo, Oportunidad
	tipo_accion?: number; // 0-Default
	fecha_inicio?: Date;
	fecha_revision?: Date;
	fecha_termino?: Date;
	reponsable?: string;
	puesto?: number;
	evidencia?: string;
	observaciones?: string;
	autoriza?: number;
	estatus?: string;
	f_captura?: Date;
	u_captura?: string;
	f_modifica?: Date;
	u_modifica?: string;
	f_cancela?: Date;
	u_cancela?: string;
	motivo_cancela?: string;
}
