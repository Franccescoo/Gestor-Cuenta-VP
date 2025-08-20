import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductoDTO } from '../models/ProductoDTO.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private base = `${environment.apiBaseUrl}/productos`;

  constructor(private http: HttpClient) {}

  getProductos(opts?: { sistemaId?: number; activo?: boolean }): Observable<ProductoDTO[]> {
    let params = new HttpParams();
    if (opts?.sistemaId != null) params = params.set('sistemaId', String(opts.sistemaId));
    if (opts?.activo != null)    params = params.set('activo', String(opts.activo));
    return this.http.get<ProductoDTO[]>(this.base, { params });
  }
}
