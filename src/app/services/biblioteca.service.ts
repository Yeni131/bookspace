import { Injectable } from '@angular/core';
export type CategoriaLectura =| 'quiero-leer'| 'leyendo' | 'leidos';
export interface LibroGuardado {
  id: string;
  titulo: string;
  portada: string;
  categoria: CategoriaLectura;
  favorito?:boolean;
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
      libros[indice] = {
        ...libros[indice],
        ...libro,
        favorito: libro.favorito ?? libros[indice].favorito
      };
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
  obtenerFavoritos(): LibroGuardado[] {
    return this.obtenerLibros().filter(
      libro => libro.favorito === true
    );
  }
  alternarFavorito(id: string): boolean {
    const libros = this.obtenerLibros();
    const libro = libros.find(item => item.id === id);
    if (!libro) {
      return false;
    }
    if (!libro.favorito && this.obtenerFavoritos().length >= 4) {
      return false;
    }
    libro.favorito = !libro.favorito;
    localStorage.setItem(
      this.clave,
      JSON.stringify(libros)
    );
    return true;
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