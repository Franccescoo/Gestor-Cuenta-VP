import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDashboardDTO } from '../models/UserDashboardDTO.model';
import { BeneficioDTO } from '../models/BeneficioDTO.model';

type MeTokenData = { playerId: string; sistemaId: number };

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /** Devuelve { playerId, sistemaId } extraídos del token */
  getMeTokenData(): Observable<MeTokenData> {
    return this.http.get<MeTokenData>(`${this.base}/usuarios/me/player-id`);
  }

  /** GET /api/players/{playerId}/systems/{rolId}/dashboard */
  getDashboard(playerId: string, rolId: number): Observable<UserDashboardDTO> {
    const url = `${this.base}/players/${encodeURIComponent(playerId)}/systems/${rolId}/dashboard`;
    return this.http.get<UserDashboardDTO>(url);
  }

getBeneficios(playerId: string, rolId: number) {
  const url = `${this.base}/players/${encodeURIComponent(playerId)}/systems/${rolId}/beneficios`;
  return this.http.get<BeneficioDTO[]>(url); // el interceptor ya añade el Bearer
}

}
