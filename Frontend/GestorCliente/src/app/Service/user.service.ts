import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserPerfilDTOResponse, mapUserPerfilResponse } from '../models/UserPerfilDTOResponse.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  /** Adjunta el Bearer si existe */
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // ---- Perfil
  getPerfil(playerId: string, sistemaId: number) {
    const params = new HttpParams()
      .set('playerId', playerId)
      .set('sistemaId', sistemaId.toString());

    return this.http
      .get<UserPerfilDTOResponse>(`${this.apiUrl}/perfil`, { params, headers: this.authHeaders() })
      .pipe(map(mapUserPerfilResponse));
  }

  // ---- Actualizar datos
  actualizarUsuario(playerId: string, sistemaId: number, body: any): Observable<any> {
    const params = new HttpParams()
      .set('playerId', playerId)
      .set('sistemaId', sistemaId.toString());

    return this.http.put(`${this.apiUrl}/actualizar`, body, { params, headers: this.authHeaders() });
  }

  // ---- Claims del token (playerId y sistemaId)
  obtenerPlayerIdYSistema(): Observable<{ playerId: string; sistemaId: number | null }> {
    return this.http.get<{ playerId: string; sistemaId: number | null }>(
      `${this.apiUrl}/me/player-id`,
      { headers: this.authHeaders() }
    );
  }

  // (si la sigues usando)
  obtenerTokenData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me/token-data`, { headers: this.authHeaders() });
  }

  // ---- OCR ejemplo
  validarDocumentoPorFoto(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    return this.http.post(`${this.apiUrl}/validar-doc`, formData, { headers: this.authHeaders() });
  }

  // ---- CAMBIO DE CONTRASEÑA
  changePassword(playerId: string, sistemaId: number, newPassword: string) {
    return this.http.put<void>(
      `${this.apiUrl}/cambiar-password`,
      { playerId, sistemaId, newPassword },
      { headers: this.authHeaders() }
    );
  }
}
