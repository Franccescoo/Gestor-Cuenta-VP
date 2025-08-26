import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialCanjeDetalle } from '../models/HistorialCanjeDetalle.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialCanjeService {

  private apiUrl = 'http://localhost:8081/api/historial-canje';

  constructor(private http: HttpClient) { }

  // Obtener historial con detalle
  getHistorialDetalle(playerId: string, sistemaId: number): Observable<HistorialCanjeDetalle[]> {
    return this.http.get<HistorialCanjeDetalle[]>(`${this.apiUrl}/${playerId}/${sistemaId}/detalle`);
  }
}
