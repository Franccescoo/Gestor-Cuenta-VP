import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  email: string;
  message: string;
  accessToken: string;
  success: boolean;
}

export interface UserData {
  playerId: string;
  sistemaId: number;
  email: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class MobileAuthService {
  private apiUrl = `${environment.apiBaseUrl}/mobile/auth`;
  private userSubject = new BehaviorSubject<UserData | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay datos de usuario guardados
    this.loadStoredUser();
  }

  /**
   * Login para usuarios móviles
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.accessToken) {
            // Guardar token
            localStorage.setItem('mobile_token', response.accessToken);
            localStorage.setItem('mobile_user_email', response.email);
            
            // Extraer datos del usuario del token (esto requeriría decodificar el JWT)
            // Por ahora usamos datos mock
            const userData: UserData = {
              playerId: 'user_' + Date.now(),
              sistemaId: 1,
              email: response.email,
              nombre: response.email.split('@')[0]
            };
            
            this.userSubject.next(userData);
            localStorage.setItem('mobile_user_data', JSON.stringify(userData));
          }
        })
      );
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('mobile_token');
    return !!token;
  }

  /**
   * Obtener token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem('mobile_token');
  }

  /**
   * Obtener headers con autenticación
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }) : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  /**
   * Obtener datos del usuario actual
   */
  getCurrentUser(): UserData | null {
    return this.userSubject.value;
  }

  /**
   * Verificar token con el servidor
   */
  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('mobile_token');
    localStorage.removeItem('mobile_user_email');
    localStorage.removeItem('mobile_user_data');
    this.userSubject.next(null);
  }

  /**
   * Cargar datos de usuario guardados
   */
  private loadStoredUser(): void {
    const storedData = localStorage.getItem('mobile_user_data');
    if (storedData && this.isAuthenticated()) {
      try {
        const userData = JSON.parse(storedData);
        this.userSubject.next(userData);
      } catch (error) {
        console.error('Error al cargar datos de usuario:', error);
        this.logout();
      }
    }
  }
}
