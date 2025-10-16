import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialCanjeDetalle } from '../models/HistorialCanjeDetalle.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialCanjeService {

  private apiUrl = `${environment.apiBaseUrl}/historial-canje`;

  constructor(private http: HttpClient) { }

  // Obtener historial con detalle
  getHistorialDetalle(playerId: string, sistemaId: number): Observable<HistorialCanjeDetalle[]> {
    return this.http.get<HistorialCanjeDetalle[]>(`${this.apiUrl}/${playerId}/${sistemaId}/detalle`);
  }
}
