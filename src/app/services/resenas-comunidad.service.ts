import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface ResenaComunidad {
  idLibro: string;
  usuarioId: number;
  usuario: string;
  calificacion: number;
  comentario: string;
}
@Injectable({
  providedIn: 'root'
})
export class ResenasComunidadService {
  constructor(private http: HttpClient) {}
  obtenerResenas(): Observable<ResenaComunidad[]> {
    return this.http.get<ResenaComunidad[]>(
      environment.resenasComunidadUrl
    );
  }
}