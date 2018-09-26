export interface UsuarioLogin {
	username: string;
	password: string;
}

export interface Usuario {
	usuario: string;
	titulo: string;
	nombre: string;
	paterno: string;
	materno: string;
	email: string;
	email2: string;
	email3: string;
	// public password: string,
	// public status: string,
	tipo: string;
	area: number;
	puesto: number;
	// public timeout: number,
	matricula?: string;
	matriz: {
		contexto: string;
		liderazgo: string;
		riesgo: string;
		oportunidad: string;
		infraestruc: string;
		clima_laboral: string;
		capacitacion: string;
		control_doctos: string;
		salida_nc: string;
		queja: string;
		satisfaccion: string;
		indicador: string;
		auditor: string;
		revision_dir: string;
		no_conformidad: string;
		mejora_continua: string;

		b_contexto: boolean;
		b_liderazgo: boolean;
		b_riesgo: boolean;
		b_oportunidad: boolean;
		b_infraestruc: boolean;
		b_clima_laboral: boolean;
		b_capacitacion: boolean;
		b_control_doctos: boolean;
		b_salida_nc: boolean;
		b_queja: boolean;
		b_satisfaccion: boolean;
		b_indicador: boolean;
		b_auditor: boolean;
		b_revision_dir: boolean;
		b_no_conformidad: boolean;
		b_mejora_continua: boolean;
	};
}

