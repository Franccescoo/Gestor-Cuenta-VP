import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmailVerificationService } from './email-verification.service';

export interface SendCredentialsRequest {
  email: string;
}

export interface SystemCredential {
  sistemaId: number;
  sistemaNombre: string;
  username: string;
  password: string;
  generated: boolean;
}

export interface SendCredentialsResponse {
  email: string;
  total: number;
  sistemas: SystemCredential[];
}

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(
    private http: HttpClient,
    private emailVerificationService: EmailVerificationService
  ) {}

  /**
   * Solicita credenciales al backend y envía email de verificación
   * @param email Email del usuario
   * @returns Observable con la respuesta
   */
  requestAndSendCredentials(email: string): Observable<any> {
    return this.http.post<SendCredentialsResponse>(
      `${environment.apiBaseUrl}/auth/send-credentials`,
      { email }
    ).pipe(
      switchMap((response) => {
        console.log('✅ Backend response received:', response);
        
        // Enviar email usando EmailJS desde el frontend
        // El backend devuelve 'sistemas', no 'items'
        return this.emailVerificationService.sendCredentialsFromBackend(
          response.email, 
          response.sistemas
        ).then((emailResult) => {
          console.log('✅ Email sent successfully:', emailResult);
          return {
            success: true,
            message: 'Credenciales enviadas exitosamente',
            data: response
          };
        }).catch((error) => {
          console.error('❌ Error sending email:', error);
          return {
            success: false,
            message: 'Error al enviar email de verificación',
            error: error
          };
        });
      }),
      catchError((error) => {
        console.error('❌ Error en requestAndSendCredentials:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Solo obtiene credenciales del backend (sin enviar email)
   * @param email Email del usuario
   * @returns Observable con las credenciales
   */
  getCredentials(email: string): Observable<SendCredentialsResponse> {
    return this.http.post<SendCredentialsResponse>(
      `${environment.apiBaseUrl}/auth/send-credentials`,
      { email }
    ).pipe(
      catchError((error) => {
        console.error('Error al obtener credenciales:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Valida formato de email
   * @param email Email a validar
   * @returns true si es válido
   */
  isValidEmail(email: string): boolean {
    return this.emailVerificationService.isValidEmail(email);
  }
}
