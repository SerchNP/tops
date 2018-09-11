export class Usuario {
	constructor(
		public usuario: string,
		public nombre: string,
		public email: string,
		public password: string,
		public status: string,
		public tipo: string,
		public area: number,
		public puesto: number,
		public timeout: number,
		public matricula?: string
	) {	}
}
