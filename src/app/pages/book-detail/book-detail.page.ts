import {Component,OnInit,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import {IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonBackButton,IonImg,IonSpinner,IonButton,IonSelect,IonSelectOption} from '@ionic/angular';
import { BooksService } from '../../services/books.service';
import {BibliotecaService,CategoriaLectura} from '../../services/biblioteca.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
  standalone: true,
  imports: [NgIf,IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonBackButton,IonImg,IonSpinner,IonButton,IonSelect,IonSelectOption]
})
export class BookDetailPage implements OnInit {
  libro: any = null;
  cargando = true;
  mensajeError = '';
  mensajeBiblioteca = '';
  idLibro = '';
  categoriaSeleccionada: CategoriaLectura = 'quiero-leer';
  constructor(private route: ActivatedRoute,private booksService: BooksService,private bibliotecaService: BibliotecaService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idLibro = id;
      this.cargarDetalle(id);
    } else {
      this.cargando = false;
      this.mensajeError = 'No se encontró el libro.';
    }
  }
  cargarDetalle(id: string): void {
    this.cargando = true;
    this.mensajeError = '';
    this.booksService.obtenerDetalleLibro(id).subscribe({
      next: (respuesta) => {
        this.libro = respuesta;
        this.cargando = false;
        const guardado = this.bibliotecaService.obtenerLibro(id);
        if (guardado) {
          this.categoriaSeleccionada = guardado.categoria;
          this.mensajeBiblioteca = 'Este libro ya está en tu biblioteca.';
        }
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
    return this.libro?.first_publish_date || 'No disponible';
  }
  cambiarCategoria(event: CustomEvent): void {
    this.categoriaSeleccionada =
      event.detail.value as CategoriaLectura;
  }
  guardarEnBiblioteca(): void {
    if (!this.libro || !this.idLibro) {
      return;
    }
    this.bibliotecaService.guardarLibro({
      id: this.idLibro,
      titulo: this.libro.title,
      portada: this.obtenerPortada(),
      categoria: this.categoriaSeleccionada
    });
    this.mensajeBiblioteca = 'Libro guardado en Mi Biblioteca.';
  }
}
