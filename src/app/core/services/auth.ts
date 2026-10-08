import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/auth.php';

  registrar(datos: any): Observable<any> {
    const payload = { accion: 'registro', ...datos };
    return this.http.post(this.apiUrl, payload);
  }

  login(credenciales: any): Observable<any> {
    const payload = { accion: 'login', ...credenciales };
    return this.http.post(this.apiUrl, payload);
  }
}