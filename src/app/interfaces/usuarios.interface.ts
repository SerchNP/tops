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
}

