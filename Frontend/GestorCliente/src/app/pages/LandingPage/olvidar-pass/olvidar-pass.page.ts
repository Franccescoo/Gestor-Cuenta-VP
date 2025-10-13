import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from 'src/app/Service/credentials.service';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-olvidar-pass',
  templateUrl: './olvidar-pass.page.html',
  styleUrls: ['./olvidar-pass.page.scss'],
})
export class OlvidarPassPage implements OnInit {

  siteKey = '6Ld3baQrAAAAAOwo96Jxr0n_oQWoz_6hi-caeaYI'; // tu clave pública
  email = '';
  loading = false;

  // Solo UI-gating
  captchaToken: string | null = null;
  isCaptchaOk = false;

  // Banner de respuesta
  status: { type: 'success' | 'error', message: string } | null = null;

  @ViewChild('captchaRef') captchaRef?: RecaptchaComponent;

  constructor(private credentialsService: CredentialsService) {}

  ngOnInit() {}

  // Captcha resuelto correctamente
  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
    this.isCaptchaOk = !!token;
  }

  // Por si expira o hay error: deshabilita botón
  onCaptchaExpired() {
    this.captchaToken = null;
    this.isCaptchaOk = false;
  }
  onCaptchaError() {
    this.captchaToken = null;
    this.isCaptchaOk = false;
  }

  private resetCaptcha() {
    this.captchaRef?.reset();
    this.captchaToken = null;
    this.isCaptchaOk = false;
  }

  enviar() {
    // Validación UI mínima
    if (!this.email || !this.isCaptchaOk) {
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
          this.resetCaptcha();
        } else {
          this.status = { 
            type: 'error', 
            message: result.message || 'Error al enviar credenciales.' 
          };
          this.resetCaptcha();
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
        this.resetCaptcha();
      }
    });
  }
}
