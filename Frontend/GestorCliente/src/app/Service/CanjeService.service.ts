// src/app/services/canje.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegistrarCanjeRequest } from '../models/RegistrarCanjeRequest.model';



@Injectable({ providedIn: 'root' })
export class CanjeService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  solicitarCanje(payload: RegistrarCanjeRequest): Observable<number> {
    // Tu backend está devolviendo "1" (number). Si cambia, ajusta el tipo.
    return this.http.post<number>(`${this.baseUrl}/historial-canje/solicitar`, payload);
  }
}
