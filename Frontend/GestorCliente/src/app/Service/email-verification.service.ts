import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';

export interface VerificationData {
  user_email: string;
  generated_password: string;
  login_url: string;
  brand_name: string;
  brand_logo: string;
  from_email: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {

  constructor() {
    // Inicializar EmailJS
    emailjs.init({ publicKey: environment.emailjs.publicKey });
  }

  /**
   * Envía email de verificación con credenciales al usuario
   * @param data Datos del usuario y credenciales
   * @returns Promise con el resultado del envío
   */
  async sendVerificationEmail(data: VerificationData): Promise<any> {
    try {
      console.log('🚀 Sending EmailJS request with:');
      console.log('- Service ID:', environment.emailjs.serviceId);
      console.log('- Template ID:', environment.emailjs.verificationTemplateId);
      console.log('- Public Key:', environment.emailjs.publicKey);
      console.log('- Template params:', {
        user_email: data.user_email,
        generated_password: data.generated_password,
        login_url: data.login_url
      });

      const result = await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.verificationTemplateId,
        {
          user_email: data.user_email,
          usuario: data.user_email,
          password: data.generated_password,
          loginUrl: data.login_url,
          brandName: data.brand_name,
          brandLogo: data.brand_logo,
          from_email: data.from_email
        }
      );

      console.log('✅ Email de verificación enviado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de verificación:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  /**
   * Envía credenciales usando los datos del backend
   * @param userEmail Email del usuario
   * @param credentials Lista de credenciales del backend
   * @returns Promise con el resultado del envío
   */
  async sendCredentialsFromBackend(userEmail: string, credentials: any[]): Promise<any> {
    try {
      console.log('📧 Preparing to send email to:', userEmail);
      console.log('📧 Credentials received:', credentials);
      
      // Usar la primera credencial como contraseña principal
      const mainPassword = credentials.length > 0 ? credentials[0].password : this.generatePassword();
      
      // URL de login (se ajusta automáticamente según el environment)
      const loginUrl = environment.production 
        ? 'https://prestige-club-2025.web.app/login' 
        : 'http://localhost:8100/login';

      const verificationData: VerificationData = {
        user_email: userEmail,
        generated_password: mainPassword,
        login_url: loginUrl,
        brand_name: environment.brandName,
        brand_logo: environment.brandLogoUrl,
        from_email: environment.fromEmailAddress
      };

      console.log('📧 Sending verification email with data:', verificationData);
      return await this.sendVerificationEmail(verificationData);
    } catch (error) {
      console.error('❌ Error al enviar credenciales desde backend:', error);
      throw error;
    }
  }

  /**
   * Genera una contraseña aleatoria segura
   * @param length Longitud de la contraseña (default: 10)
   * @returns Contraseña generada
   */
  generatePassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }

  /**
   * Valida formato de email
   * @param email Email a validar
   * @returns true si es válido
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
