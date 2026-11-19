
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import {IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonBackButton,IonImg,IonSpinner} from '@ionic/angular';
import { BooksService } from '../../services/books.service';
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonImg,
    IonSpinner,
    NgIf
  ]
})
export class BookDetailPage implements OnInit {
  libro: any = null;
  cargando = true;
  mensajeError = '';
  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDetalle(id);
    } else {
      this.cargando = false;
      this.mensajeError = 'No se encontró el libro.';
    }
  }
  cargarDetalle(id: string) {
    this.booksService.obtenerDetalleLibro(id).subscribe({
      next: (respuesta) => {
        this.libro = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.mensajeError = 'No se pudo cargar el libro.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
  obtenerPortada(): string {
    if (this.libro?.covers?.length) {
      return `https://covers.openlibrary.org/b/id/${this.libro.covers[0]}-L.jpg`;
    }
    return 'assets/icon/favicon.png';
  }
  obtenerDescripcion(): string {
    const descripcion = this.libro?.description;
    if (typeof descripcion === 'string') {
      return descripcion;
    }
    return descripcion?.value || 'Sin descripción disponible.';
  }
  obtenerAnio(): string {
    const fecha = this.libro?.first_publish_date;
    return fecha || 'No disponible';
  }
}
