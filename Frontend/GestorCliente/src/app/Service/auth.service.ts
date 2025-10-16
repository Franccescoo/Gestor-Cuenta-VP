import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SendCredentialsResponse } from '../models/SendCredentialsResponse.model';

/** ==== Helpers para decodificar el JWT (sin librerías externas) ==== */
export interface JwtPayload {
  sub: string;
  iss: string;
  exp: number;
  nbf?: number;
  iat?: number;
  sistemaId?: number;
  sistemaNombre?: string;
  authorities?: string[] | string;
  id?: number;      // por si tu backend lo envía así
  userId?: number;  // alias común
  [k: string]: any; // cualquier otro claim
}

function b64urlDecode(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  // Maneja UTF-8 correctamente
  return decodeURIComponent(atob(input).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(b64urlDecode(parts[1]));
  } catch {
    return null;
  }
}
/** ================================================================ */

@Injectable({ providedIn: 'root' })
export class AuthService {
  sendCredentialsByPhone(numero: string) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly DEFAULT_ISS = 'AUTH-backend'; // ← Emisor esperado
  private readonly SKEW = 60;                    // tolerancia (seg) para reloj del cliente

  constructor(private http: HttpClient) {}

  /** ====== API ====== */
  sendCredentials(email: string): Observable<SendCredentialsResponse> {
    return this.http.post<SendCredentialsResponse>(`${this.baseUrl}/send-credentials`, { email });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      map(res => {
        if (res?.jwt) {
          localStorage.setItem('token', res.jwt);
          if (res.sistema) localStorage.setItem('sistema', res.sistema);
          if (res.email)   localStorage.setItem('email', res.email);
          
          // ✅ Guardar timestamp de login para expiración automática
          const loginTime = new Date().getTime();
          localStorage.setItem('loginTime', loginTime.toString());
        }
        return res;
      })
    );
  }

  /** ====== Storage ====== */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getSistema(): string | null {
    return localStorage.getItem('sistema');
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('sistema');
    localStorage.removeItem('email');
    localStorage.removeItem('loginTime');
    // si guardas más cosas, límpialas aquí
  }

  /** ====== JWT utils ====== */
  getPayload(): JwtPayload | null {
    const t = this.getToken();
    return t ? parseJwt(t) : null;
  }

  /** Valida exp/nbf/iss/sistemaId y existencia de sub */
  isPayloadValid(p?: JwtPayload | null, issuerExpected?: string): boolean {
    if (!p) return false;
    const now = Math.floor(Date.now() / 1000);

    if (!p.sub) return false;
    if (!p.exp || now >= p.exp - this.SKEW) return false;
    if (p.nbf && now + this.SKEW < p.nbf) return false;

    const expected = issuerExpected ?? this.DEFAULT_ISS;
    if (!p.iss || p.iss !== expected) return false;

    if (typeof p.sistemaId !== 'number') return false;

    // ✅ Verificar expiración automática de 24 horas
    if (!this.isSessionValid()) return false;

    return true;
  }

  /** ✅ Verificar si la sesión es válida (no ha expirado por tiempo) */
  private isSessionValid(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return false;

    const loginTimestamp = parseInt(loginTime, 10);
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

    return (now - loginTimestamp) < twentyFourHours;
  }

  /** Usa la validación real en vez de “existe token” */
  isAuthenticated(): boolean {
    return this.isPayloadValid(this.getPayload(), this.DEFAULT_ISS);
  }

  /** Roles: soporta string o string[] en "authorities" */
  getRoles(): string[] {
    const a = this.getPayload()?.authorities;
    if (!a) return [];
    return Array.isArray(a) ? a : [a];
  }
  getRoleFromToken(): string | null {
    const roles = this.getRoles();
    return roles.length ? roles[0] : null;
  }

  /** Username/email del claim 'sub' */
  getUsernameFromToken(): string | null {
    return this.getPayload()?.sub ?? null;
  }

  /** Expiración como Date */
  getTokenExpirationDate(): Date | null {
    const exp = this.getPayload()?.exp;
    if (!exp) return null;
    const d = new Date(0);
    d.setUTCSeconds(exp);
    return d;
  }

  isTokenExpired(): boolean {
    const exp = this.getPayload()?.exp;
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  }

  /** Id del usuario si lo incluyes como 'id' o 'userId' */
  getUserId(): number | null {
    const p = this.getPayload();
    return (p?.id ?? p?.userId) ?? null;
  }
}
