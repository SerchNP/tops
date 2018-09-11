export class Proceso {
	constructor(
		public proceso: number,
		public pred: number,
		public descrip: string,
		public autoriza: number,
		public estatus: string,
		public ent_data: string,
		public f_captura?: Date,
		public u_captura?: string,
		public f_autoriza?: Date,
		public u_autoriza?: string,
		public f_modifica?: Date,
		public u_modifica?: string,
		public f_cancela?: Date,
		public u_cancela?: string,
		public motivo_cancela?: string
	) {	}
}
