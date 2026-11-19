import { Injectable } from '@angular/core';
export type CategoriaLectura =| 'quiero-leer'| 'leyendo' | 'leidos';
export interface LibroGuardado {
  id: string;
  titulo: string;
  portada: string;
  categoria: CategoriaLectura;
}
@Injectable({
  providedIn: 'root'
})
export class BibliotecaService {
  private readonly clave = 'bookspace_biblioteca';
  obtenerLibros(): LibroGuardado[] {
    const datos = localStorage.getItem(this.clave);
    if (!datos) {
      return [];
    }
    try {
      return JSON.parse(datos) as LibroGuardado[];
    } catch {
      return [];
    }
  }
  obtenerLibro(id: string): LibroGuardado | undefined {
    return this.obtenerLibros().find(
      libro => libro.id === id
    );
  }
  guardarLibro(libro: LibroGuardado): void {
    const libros = this.obtenerLibros();
    const indice = libros.findIndex(
      item => item.id === libro.id
    );
    if (indice >= 0) {
      libros[indice] = libro;
    } else {
      libros.push(libro);
    }
    localStorage.setItem(
      this.clave,
      JSON.stringify(libros)
    );
  }

  obtenerPorCategoria(
    categoria: CategoriaLectura
  ): LibroGuardado[] {
    return this.obtenerLibros().filter(
      libro => libro.categoria === categoria
    );
  }

  eliminarLibro(id: string): void {
    const libros = this.obtenerLibros().filter(
      libro => libro.id !== id
    );

    localStorage.setItem(
      this.clave,
      JSON.stringify(libros)
    );
  }
}