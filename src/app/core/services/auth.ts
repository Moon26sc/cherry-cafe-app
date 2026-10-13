import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/auth.php';

  private currentUserSubject = new BehaviorSubject<any>(this.getUsuarioGuardado());
  
  public currentUser$ = this.currentUserSubject.asObservable();

  private getUsuarioGuardado() {
    const user = localStorage.getItem('cherry_user');
    return user ? JSON.parse(user) : null;
  }

  registrar(datos: any): Observable<any> {
    const payload = { accion: 'registro', ...datos };
    return this.http.post(this.apiUrl, payload);
  }

  login(credenciales: any): Observable<any> {
    const payload = { accion: 'login', ...credenciales };
    
    return this.http.post(this.apiUrl, payload).pipe(
      tap((respuesta: any) => {
        localStorage.setItem('cherry_user', JSON.stringify(respuesta.usuario));
        this.currentUserSubject.next(respuesta.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('cherry_user');
    this.currentUserSubject.next(null);
  }
}