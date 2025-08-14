import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

 // ACTUALIZAR DATOS DEL USUARIO
  actualizarUsuario(playerId: string, sistemaId: number, body: any): Observable<any> {
    const params = new HttpParams()
      .set('playerId', playerId)
      .set('sistemaId', sistemaId.toString());

    return this.http.put(`${this.apiUrl}/actualizar`, body, { params });
  }

  obtenerPlayerId(): Observable<{ playerId: string }> {
    return this.http.get<{ playerId: string }>(`${this.apiUrl}/me/player-id`);
  }
    
  obtenerTokenData(): Observable<any> {
    const token = localStorage.getItem('token'); // O ajusta según donde guardas el JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/me/token-data`, { headers });
  }
  
  validarDocumentoPorFoto(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    return this.http.post(`${this.apiUrl}/validar-doc`, formData);
  }
    
}
