import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Cambia esta URL si es necesario
  private baseUrl = "http://localhost:8080/api/auth";
  
  constructor(private http: HttpClient) { }
  
  
  login(usuario: string, password: string): Observable<any> {
    // ENVÍA "username" y "password" (no "usuario")
    return this.http.post<any>(`${this.baseUrl}/login`, { 
        username: usuario, 
        password: password 
      }).pipe(
        map(res => {
          if (res && res.jwt) {
            localStorage.setItem('token', res.jwt);
            localStorage.setItem('sistema', res.sistema); // Guarda el sistema
            localStorage.setItem('username', res.username); // Guarda el nombre de usuario (opcional)
          }
          return res;
        })
      );
  }
  
    
  getSistema(): string | null {
    return localStorage.getItem('sistema');
  }  
  

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.authorities || null;
    }
    return null;
  }

  getTokenExpirationDate(): Date | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp) {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        return expirationDate;
      }
    }
    return null;
  }

  isTokenExpired(): boolean {
    const expirationDate = this.getTokenExpirationDate();
    if (expirationDate) {
      return expirationDate.valueOf() < new Date().valueOf();
    }
    return true;
  }
  
  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.id || null;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getUserNameFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || '';
  }
  
  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.sub || null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
  


}
function jwtDecode(token: string): any {
    throw new Error('Function not implemented.');
}

