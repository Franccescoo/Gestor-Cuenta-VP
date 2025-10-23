import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MobileAuthService } from './mobile-auth.service';

export interface BeneficioCanjeado {
  beneficioId: number;
  nombreBeneficio: string;
  categoria: string;
  estado: string;
  fechaCanje: string;
  fechaDisponible: string;
  diasRestantes: number;
  codigoPromocion: string;
  descripcion?: string;
  imagenUrl?: string;
}

export interface DetalleBeneficioCanjeado {
  beneficioId: number;
  nombreBeneficio: string;
  categoria: string;
  descripcion: string;
  codigoPromocion: string;
  estado: string;
  fechaCanje: string;
  fechaDisponible: string;
  diasRestantes: number;
  imagenUrl?: string;
  instruccionesUso: string;
  terminosCondiciones: string;
  tiendaAplicable: string;
  contacto: string;
}

@Injectable({
  providedIn: 'root'
})
export class MobileBeneficiosService {
  private apiUrl = `${environment.apiBaseUrl}/mobile/beneficios`;

  constructor(
    private http: HttpClient,
    private authService: MobileAuthService
  ) {}

  /**
   * Obtener beneficios canjeados del usuario autenticado
   */
  getBeneficiosCanjeados(): Observable<BeneficioCanjeado[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const params = new HttpParams()
      .set('playerId', user.playerId)
      .set('sistemaId', user.sistemaId.toString());

    return this.http.get<BeneficioCanjeado[]>(`${this.apiUrl}/canjeados`, {
      params,
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Obtener detalle de un beneficio canjeado específico
   */
  getDetalleBeneficio(beneficioId: number): Observable<DetalleBeneficioCanjeado> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const params = new HttpParams()
      .set('playerId', user.playerId)
      .set('sistemaId', user.sistemaId.toString());

    return this.http.get<DetalleBeneficioCanjeado>(`${this.apiUrl}/canjeados/${beneficioId}/detalle`, {
      params,
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Obtener beneficios disponibles para canjear
   */
  getBeneficiosDisponibles(): Observable<BeneficioCanjeado[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const params = new HttpParams()
      .set('playerId', user.playerId)
      .set('sistemaId', user.sistemaId.toString());

    return this.http.get<BeneficioCanjeado[]>(`${this.apiUrl}/disponibles`, {
      params,
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Formatear fecha para mostrar
   */
  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Obtener estado del beneficio para mostrar
   */
  getEstadoBeneficio(beneficio: BeneficioCanjeado): string {
    if (beneficio.diasRestantes > 0) {
      return `Disponible en ${beneficio.diasRestantes} días`;
    } else {
      return 'Disponible ahora';
    }
  }

  /**
   * Verificar si el beneficio está disponible
   */
  isBeneficioDisponible(beneficio: BeneficioCanjeado): boolean {
    return beneficio.diasRestantes <= 0;
  }
}
