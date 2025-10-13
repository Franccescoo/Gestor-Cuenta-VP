import { Component, OnInit } from '@angular/core';
import { CredentialsService } from 'src/app/Service/credentials.service';

@Component({
  selector: 'app-verificar-cuenta',
  templateUrl: './verificar-cuenta.page.html',
  styleUrls: ['./verificar-cuenta.page.scss'],
})
export class VerificarCuentaPage implements OnInit {
  siteKey = '6Ld3baQrAAAAAOwo96Jxr0n_oQWoz_6hi-caeaYI'; // reCAPTCHA pública
  email = '';
  captchaToken: string | null = null;
  loading = false;

  // Estado para banners de éxito/error
  status: { type: 'success' | 'error', message: string } | null = null;

  constructor(
    private credentialsService: CredentialsService
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

    // Validar formato de email
    if (!this.credentialsService.isValidEmail(this.email)) {
      this.status = { type: 'error', message: 'Formato de email inválido.' };
      return;
    }

    this.loading = true;
    this.status = null;

    // Usar el nuevo servicio que maneja backend + EmailJS
    this.credentialsService.requestAndSendCredentials(this.email).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.status = {
            type: 'success',
            message: `¡Listo! Enviamos las credenciales a ${result.data.email}.`
          };
          // Limpiar el token del captcha
          this.captchaToken = null;
        } else {
          this.status = { 
            type: 'error', 
            message: result.message || 'Error al enviar credenciales.' 
          };
        }
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 404) {
          this.status = { type: 'error', message: 'Email no encontrado.' };
        } else if (err?.status === 400) {
          this.status = { type: 'error', message: 'Formato de email inválido.' };
        } else {
          console.error('Error completo:', err);
          this.status = { type: 'error', message: 'Ocurrió un error. Inténtalo nuevamente.' };
        }
      }
    });
  }
}
