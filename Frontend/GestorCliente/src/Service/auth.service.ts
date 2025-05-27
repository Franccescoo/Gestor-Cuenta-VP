import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';
  
  constructor(private http: HttpClient) { }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.authorities || null;
    }
    return null;
  }

}
