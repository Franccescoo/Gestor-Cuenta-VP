import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  completarRegistro(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/completar-registro`, data);
  }
}
