import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {
  submitted = false;
  loading = false;
  showPassword = false;
  errorMessage = '';


  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    remember: [true],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    localStorage.clear();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

onSubmit() {
  this.submitted = true;
  this.errorMessage = ''; // limpia el error

  if (this.form.invalid) return;

  this.loading = true;
  const { email, password, remember } = this.form.value;

  this.authService.login(email!, password!).subscribe({
    next: (res: any) => {
      this.loading = false;
      if (res && res.status) {
        localStorage.setItem('token', res.jwt);
        localStorage.setItem('sistema', res.sistema);
        if (remember) {
          localStorage.setItem('email', email!);
        }
        if (res.debeCompletarRegistro) {
          this.router.navigate(['/info-usuario']);
        } else {
          this.router.navigate(['/menu']);
        }
      } else {
        this.errorMessage = res?.message || 'Email o contraseña incorrectos';
      }
    },
    error: () => {
      this.loading = false;
      this.errorMessage = 'No se pudo conectar. Intenta de nuevo.';
    }
  });
}



}
