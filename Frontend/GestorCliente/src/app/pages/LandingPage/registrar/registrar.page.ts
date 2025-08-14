import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss']
})
export class RegistrarPage {

  form: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required]],
      rut:       ['', [Validators.required, this.rutValidator]],
      phone:     ['', [Validators.required, Validators.minLength(8)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(8)]],
      confirm:   ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator }
  );

  constructor(private fb: FormBuilder, private router: Router) {}

  isInvalid(ctrl: keyof typeof this.form.value) {
    const c = this.form.get(ctrl as string)!;
    return c.invalid && (c.dirty || c.touched);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: enviar a tu API
    console.log('Registro OK', this.form.value);
    // redirección ejemplo:
    this.router.navigateByUrl('/inicio');
  }

  goBack() { this.router.navigateByUrl('/inicio'); }

  // ----- Validadores -----
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
  }

  private rutValidator(control: AbstractControl): ValidationErrors | null {
    const val: string = (control.value || '').toString().replace(/\./g, '').toUpperCase();
    if (!/^\d{7,8}-[\dkK]$/.test(val)) return { rut: true };
    const [numStr, dv] = val.split('-');
    let s = 1, m = 0;
    for (let i = numStr.length - 1; i >= 0; i--) {
      s = (s + +numStr[i] * (9 - (m++ % 6))) % 11;
    }
    const dig = s ? String(s - 1) : 'K';
    return dig === dv ? null : { rut: true };
  }
  get passwordMismatch(): boolean {
  return !!this.form.errors?.['passwordMismatch'] && (this.form.touched || this.form.dirty);
}

}
