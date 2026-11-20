import { Injectable } from '@angular/core';
export interface Resena {
  idLibro: string;
  tituloLibro: string;
  calificacion: number;
  comentario: string;
}
@Injectable({
  providedIn: 'root'
})
export class ResenasService {
  private readonly clave = 'bookspace_resenas';
  obtenerResenas(): Resena[] {
    const datos = localStorage.getItem(this.clave);
    if (!datos) {
      return [];
    }
    try {
      return JSON.parse(datos) as Resena[];
    } catch {
      return [];
    }
  }
  obtenerResenaLibro(idLibro: string): Resena | undefined {
    return this.obtenerResenas().find(
      resena => resena.idLibro === idLibro
    );
  }
  guardarResena(resena: Resena): void {
    const resenas = this.obtenerResenas();
    const indice = resenas.findIndex(
      item => item.idLibro === resena.idLibro
    );
    if (indice >= 0) {
      resenas[indice] = resena;
    } else {
      resenas.push(resena);
    }
    localStorage.setItem(
      this.clave,
      JSON.stringify(resenas)
    );
  }
}
