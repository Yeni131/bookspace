import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BooksService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient){}
    buscarLibros(texto: string): Observable<any>{
        return this.http.get<any>(
            `${this.apiUrl}/search.json`,
            {
                params: {
                    q: `${texto} language:spa`,
                    limit:'20'
                }
            }
        );
    }
    obtenerLibrosIniciales(): Observable<any>{
        return this.http.get<any>(
            `${this.apiUrl}/search.json`,
            {
                params: {
                    q: 'title:"Cien años de soledad" OR title:"Don Quijote de la Mancha" OR title:"Rayuela" OR title:"La casa de los espíritus"',
                    limit: '8'
                }
            }
        );
    }
    obtenerDetalleLibro(id: string): Observable<any> {
    return this.http.get<any>(
    `${this.apiUrl}/works/${id}.json`
    );
    }
}
