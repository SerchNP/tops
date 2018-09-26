import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

const regExp: RegExp = new RegExp(/([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})$/);
// const regExp: RegExp = new RegExp(/^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+\.+([a-z0-9]{2,4})+$/);
// const regExp: RegExp = new RegExp('^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+.[a-zA-Z0–9-.]+$');

export const correoValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
	const email = control.get('email');
	let bandera = false;
	if (email.value.length === 0) {
		bandera = false;
	} else {
		if (regExp.test(email.value)) {
			bandera = false;
		} else {
			bandera = true;
		}
	}
	return bandera ? { 'correoValidator': true } : null;
};

export const correo2Validator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
	const email = control.get('email2');
	let bandera = false;
	if (email.value.length === 0) {
		bandera = false;
	} else {
		if (regExp.test(email.value)) {
			bandera = false;
		} else {
			bandera = true;
		}
	}
	return bandera ? { 'correo2Validator': true } : null;
};

export const correo3Validator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
	const email = control.get('email3');
	let bandera = false;
	if (email.value.length === 0) {
		bandera = false;
	} else {
		if (regExp.test(email.value)) {
			bandera = false;
		} else {
			bandera = true;
		}
	}
	return bandera ? { 'correo3Validator': true } : null;
};
