
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import {  IonHeader,  IonToolbar,  IonTitle,  IonContent,  IonGrid,  IonRow,  IonCol,  IonCard,  IonCardContent,  IonImg,  IonSearchbar,  IonSpinner} from '@ionic/angular';
import { BooksService } from '../services/books.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [NgFor,NgIf,IonHeader,IonToolbar,IonTitle,IonContent,IonGrid,IonRow,IonCol,IonCard,IonCardContent,IonImg,IonSearchbar,IonSpinner]
})
export class Tab1Page implements OnInit {
  libros: any[] = [];
  cargando = false;
  mensajeError = '';
  categoriaSeleccionada:string | null=null;
  busquedaActiva=false;
  constructor(private booksService: BooksService,private cdr: ChangeDetectorRef,private router: Router) {}
  ngOnInit(): void {
    this.cargarLibros();
  }
  seleccionarCategoria(categoria:string): void{
    this.categoriaSeleccionada=categoria;
    this.cargando=true;
    this.mensajeError='';
    this.libros=[];
    this.booksService.obtenerLibrosPorCategoria(categoria).subscribe({
      next:(respuesta)=>{
        this.libros=respuesta.docs|| [];
        this.cargando=false;
        this.cdr.detectChanges();
      },
      error:(error)=>{
        console.error('Error al cargar categoria:',error);
        this.mensajeError='No se pudieron cargar los libros de esta categoria.';
        this.cargando=false;
        this.cdr.detectChanges();
      }
    });
  }
  volverARecomendados():void{
    this.categoriaSeleccionada=null;
    this.cargarLibros();
  }
  cargarLibros(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.libros = [];
    this.booksService.obtenerLibrosIniciales().subscribe({
      next: (respuesta) => {
        this.libros = respuesta.docs || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
        this.mensajeError = 'No se pudieron cargar los libros.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
  buscarLibros(event: any): void {
    const texto = event.detail.value?.trim() || '';
    this.busquedaActiva=texto.length>0;
    if (!texto) {
      this.categoriaSeleccionada=null;
      this.cargarLibros();
      return;
    }
    this.consultarLibros(texto);
  }
  consultarLibros(texto: string): void {
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
    if (libro.cover_i) {
      return `https://covers.openlibrary.org/b/id/${libro.cover_i}-L.jpg`;
    }
    return 'assets/icon/favicon.png';
  }
  verDetalle(libro: any): void {
    if (!libro.key) {
      return;
    }
    const id = libro.key.split('/').pop();
    this.router.navigate(['/libro', id]);
  }
}
