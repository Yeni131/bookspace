import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid,IonRow,IonCol,IonCard,IonCardContent,IonImg,IonSearchbar,IonSpinner} from '@ionic/angular';
import { NgFor, NgIf } from '@angular/common';
import { BooksService } from '../services/books.service';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid,IonRow,IonCol,IonCard,IonCardContent,IonImg,IonSearchbar,IonSpinner, NgFor,  NgIf, ExploreContainerComponent],
})
export class Tab1Page implements OnInit{
  libros: any[] = [];
  cargando = false;
  mensajeError = '';
  constructor(private booksService: BooksService,private cdr: ChangeDetectorRef,private router: Router) {}
  ngOnInit(): void {
    this.cargarLibros();
  } 
  cargarLibros() {
    this.cargando= true;
    this,this.mensajeError = '';
    this.libros = [];
    this.booksService.obtenerLibrosIniciales().subscribe({
      next: (respuesta) => {
        this.libros = respuesta.docs || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar libros:',error);
        this.mensajeError = 'No se pudieron cargar los libros.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
buscarLibros(event: any) {
  const texto = event.detail.value?.trim() || '';
  if (!texto) {
    this.cargarLibros();
    return;
  }
  this.consultarLibros(texto);
}
consultarLibros(texto: string) {
  this.cargando = true;
  this.mensajeError = '';
  this.libros = [];
  this.booksService.buscarLibros(texto).subscribe({
    next: (respuesta) => {
      this.libros = respuesta.docs || [];
      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al consultar libros:', error);

      this.mensajeError = 'No se pudieron cargar los libros. Intentá nuevamente.';
      this.cargando = false;
      this.cdr.detectChanges();
    }
  });
}
  obtenerPortada(libro: any): string {
    if(libro.cover_i){
       return `https://covers.openlibrary.org/b/id/${libro.cover_i}-L.jpg`;
    }
    return 'assets/icon/favicon.png';
  }
  verDetalle(libro: any) {
  if (!libro.key) {
    return;
  }
  const id = libro.key.split('/').pop();
  this.router.navigate(['/libro', id]);
}
}
