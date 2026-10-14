import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/usuarios_admin.php';

  obtenerClientes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  guardarUsuario(usuario: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/guardar_usuario.php', usuario);
  }

}