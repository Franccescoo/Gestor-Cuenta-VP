import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudCambioPerfil, CrearSolicitudRequest, AprobarSolicitudRequest, RechazarSolicitudRequest, EstadisticasSolicitudes } from '../models/SolicitudCambioPerfil.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudCambioPerfilService {
  private apiUrl = 'http://localhost:8080/api/solicitudes-cambio-perfil';

  constructor(private http: HttpClient) {}

  /** Adjunta el Bearer si existe */
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  /**
   * Crear una nueva solicitud de cambio de perfil
   */
  crearSolicitud(request: CrearSolicitudRequest): Observable<SolicitudCambioPerfil> {
    return this.http.post<SolicitudCambioPerfil>(`${this.apiUrl}`, request, { 
      headers: this.authHeaders() 
    });
  }

  /**
   * Obtener solicitudes de un usuario específico
   */
  obtenerSolicitudesUsuario(playerId: string, sistemaId: number): Observable<SolicitudCambioPerfil[]> {
    const params = new HttpParams()
      .set('playerId', playerId)
      .set('sistemaId', sistemaId.toString());

    return this.http.get<SolicitudCambioPerfil[]>(`${this.apiUrl}/usuario`, { 
      params, 
      headers: this.authHeaders() 
    });
  }

  /**
   * Obtener una solicitud específica del usuario
   */
  obtenerSolicitud(solicitudId: number, playerId: string, sistemaId: number): Observable<SolicitudCambioPerfil> {
    const params = new HttpParams()
      .set('playerId', playerId)
      .set('sistemaId', sistemaId.toString());

    return this.http.get<SolicitudCambioPerfil>(`${this.apiUrl}/${solicitudId}`, { 
      params, 
      headers: this.authHeaders() 
    });
  }

  /**
   * Obtener todas las solicitudes (para administradores)
   */
  obtenerTodasLasSolicitudes(): Observable<SolicitudCambioPerfil[]> {
    return this.http.get<SolicitudCambioPerfil[]>(`${this.apiUrl}/admin/todas`, { 
      headers: this.authHeaders() 
    });
  }

  /**
   * Obtener solo solicitudes pendientes (para administradores)
   */
  obtenerSolicitudesPendientes(): Observable<SolicitudCambioPerfil[]> {
    return this.http.get<SolicitudCambioPerfil[]>(`${this.apiUrl}/admin/pendientes`, { 
      headers: this.authHeaders() 
    });
  }

  /**
   * Aprobar una solicitud (solo administradores)
   */
  aprobarSolicitud(solicitudId: number, request: AprobarSolicitudRequest): Observable<SolicitudCambioPerfil> {
    return this.http.put<SolicitudCambioPerfil>(`${this.apiUrl}/${solicitudId}/aprobar`, request, { 
      headers: this.authHeaders() 
    });
  }

  /**
   * Rechazar una solicitud (solo administradores)
   */
  rechazarSolicitud(solicitudId: number, request: RechazarSolicitudRequest): Observable<SolicitudCambioPerfil> {
    return this.http.put<SolicitudCambioPerfil>(`${this.apiUrl}/${solicitudId}/rechazar`, request, { 
      headers: this.authHeaders() 
    });
  }

  /**
   * Obtener estadísticas de solicitudes (para administradores)
   */
  obtenerEstadisticas(): Observable<EstadisticasSolicitudes> {
    return this.http.get<EstadisticasSolicitudes>(`${this.apiUrl}/admin/estadisticas`, { 
      headers: this.authHeaders() 
    });
  }
}
