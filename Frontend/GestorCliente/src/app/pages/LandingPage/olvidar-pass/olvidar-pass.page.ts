import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/Service/auth.service';
import { SendCredentialsResponse } from 'src/app/models/SendCredentialsResponse.model';
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

  constructor(private auth: AuthService) {}

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
    // Validación UI mínima (sin enviar token al backend)
    if (!this.email || !this.isCaptchaOk) {
      this.status = { type: 'error', message: 'Completa email y captcha.' };
      return;
    }

    this.loading = true;
    this.status = null;

    // IMPORTANTE: solo email (sin token)
    this.auth.sendCredentials(this.email).subscribe({
      next: (res: SendCredentialsResponse) => {
        this.loading = false;
        this.status = { type: 'success', message: `Listo. Enviamos el enlace a ${res.email}.` };
        this.resetCaptcha();
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 404) {
          this.status = { type: 'error', message: 'Email no encontrado.' };
        } else {
          console.error(err);
          this.status = { type: 'error', message: 'Ocurrió un error. Inténtalo nuevamente.' };
        }
        this.resetCaptcha();
      }
    });
  }
}
