import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular';
import { NgFor } from '@angular/common';
import { BooksService } from '../services/books.service';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, NgFor,  ExploreContainerComponent],
})
export class Tab1Page implements OnInit{
  libros: any[] = [];
  constructor(private booksService: BooksService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.cargarLibros();
  }
  cargarLibros(){
     this.booksService.buscarLibros('Harry Potter').subscribe({
    next: (respuesta) => {
      this.libros = respuesta.docs || [];

      console.log('Libros recibidos:', this.libros.length);

      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al cargar libros:', error);
    }
  });
  }
}
