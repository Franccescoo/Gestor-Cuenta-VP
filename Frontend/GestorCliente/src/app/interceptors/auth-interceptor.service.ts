import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isDpaChile = req.url.startsWith('https://apis.digital.gob.cl/dpa');

    if (isDpaChile) {
      // No tocar peticiones externas de la DPA
      return next.handle(req);
    }

    const token = localStorage.getItem('token');
    if (!token) return next.handle(req);

    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(authReq);
  }
}
