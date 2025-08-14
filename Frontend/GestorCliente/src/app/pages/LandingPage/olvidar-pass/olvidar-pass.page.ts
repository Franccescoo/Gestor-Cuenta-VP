import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/Service/auth.service';
import { SendCredentialsResponse } from 'src/app/models/SendCredentialsResponse.model';

@Component({
  selector: 'app-olvidar-pass',
  templateUrl: './olvidar-pass.page.html',
  styleUrls: ['./olvidar-pass.page.scss'],
})
export class OlvidarPassPage implements OnInit {

  siteKey = '6Ld3baQrAAAAAOwo96Jxr0n_oQWoz_6hi-caeaYI'; // reCAPTCHA pública
  email = '';
  captchaToken: string | null = null;
  loading = false;

  // Estado para banners de éxito/error
  status: { type: 'success' | 'error', message: string } | null = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  enviar() {
    // Validación mínima en UI
    if (!this.email || !this.captchaToken) {
      this.status = { type: 'error', message: 'Completa email y captcha.' };
      return;
    }

    this.loading = true;
    this.status = null;

    this.auth.sendCredentials(this.email).subscribe({
      next: (res: SendCredentialsResponse) => {
        this.loading = false;
        this.status = {
          type: 'success',
          message: `Listo. Enviamos el enlace a ${res.email}.`
        };
        // Si quieres, limpia el token del captcha
        this.captchaToken = null;
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 404) {
          this.status = { type: 'error', message: 'Email no encontrado.' };
        } else {
          console.error(err);
          this.status = { type: 'error', message: 'Ocurrió un error. Inténtalo nuevamente.' };
        }
      }
    });
  }
}
