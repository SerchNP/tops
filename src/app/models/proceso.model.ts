export class Proceso {
	constructor(
		public proceso: number,
		public proceso_desc: string,
		public autoriza: number,
		public autoriza_desc: string,
		public estatus: string,
		public estatus_desc: string,
		public ent_data: string,
		public f_captura: Date,
		public u_captura: string,

		public predecesor?: number,
		public predecesor_desc?: string,
		public sistema?: number,
		public sistema_desc?: string,
		public objetivo?: string,
		public apartados?: string,
		public responsable?: string,

		public f_autoriza?: Date,
		public u_autoriza?: string,
		public f_modifica?: Date,
		public u_modifica?: string,
		public f_cancela?: Date,
		public u_cancela?: string,
		public motivo_cancela?: string
	) {	}
}
