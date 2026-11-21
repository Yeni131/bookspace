import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface UsuarioComunidad {
  id: number;
  nombre: string;
  usuario: string;
  biografia: string;
  avatar: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsuariosComunidadService {
  constructor(private http: HttpClient) {}
  obtenerUsuarios(): Observable<UsuarioComunidad[]> {
    return this.http.get<UsuarioComunidad[]>(
      environment.usuariosComunidadUrl
    );
  }
}
