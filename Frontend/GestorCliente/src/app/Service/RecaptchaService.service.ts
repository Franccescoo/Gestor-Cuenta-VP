// src/app/core/recaptcha.service.ts
import { Injectable, NgZone } from '@angular/core';

declare const grecaptcha: any;

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private widgetId?: number;

  constructor(private zone: NgZone) {}

  render(container: HTMLElement, siteKey: string, callback: (token: string) => void) {
    // Espera a que cargue grecaptcha
    const renderNow = () => {
      this.widgetId = grecaptcha.render(container, {
        sitekey: siteKey,
        callback: (token: string) => this.zone.run(() => callback(token)),
        'expired-callback': () => this.zone.run(() => callback('')),
        'error-callback': () => this.zone.run(() => callback('')),
      });
    };

    if (typeof grecaptcha !== 'undefined') renderNow();
    else window.addEventListener('grecaptchaLoaded', renderNow, { once: true });
  }

  reset() {
    if (typeof grecaptcha !== 'undefined' && this.widgetId !== undefined) {
      grecaptcha.reset(this.widgetId);
    }
  }
}
