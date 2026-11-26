import {Component,OnInit,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf,NgFor,DecimalPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonBackButton,IonImg,IonSpinner,IonButton,IonSelect,IonSelectOption, IonText, IonTextarea, IonIcon} from '@ionic/angular';
import { BooksService } from '../../services/books.service';
import {BibliotecaService,CategoriaLectura} from '../../services/biblioteca.service';
import { ResenasService } from '../../services/resenas.service';
import { ResenasComunidadService, ResenaComunidad } from '../../services/resenas-comunidad.service';
import { addIcons } from 'ionicons';
import { star, starOutline, heart,heartOutline,chevronBack, chevronBackOutline } from 'ionicons/icons';
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
  standalone: true,
  imports: [NgIf,IonHeader,IonToolbar,IonTitle,IonContent,IonButtons,IonBackButton,IonImg,IonSpinner,IonButton,IonSelect,IonSelectOption,FormsModule,NgFor,IonTextarea,IonIcon,DecimalPipe]
})
export class BookDetailPage implements OnInit {
  libro: any = null;
  cargando = true;
  mensajeError = '';
  mensajeBiblioteca = '';
  idLibro = '';
  categoriaSeleccionada: CategoriaLectura = 'quiero-leer';
  calificacion=0;
  comentario='';
  mensajeResena='';
  resenasComunidad: ResenaComunidad[] = [];
  promedioComunidad = 0;
  cargandoResenasComunidad = false;
  mensajeErrorResenasComunidad = '';
  esFavorito = false;
  mensajeFavorito = '';
  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private bibliotecaService: BibliotecaService,
    private resenasService: ResenasService,
    private resenasComunidadService: ResenasComunidadService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ star, starOutline,heart,heartOutline,chevronBackOutline });
  }
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
          this.esFavorito = guardado.favorito === true;
        }
        const resenaGuardada=this.resenasService.obtenerResenaLibro(id);
        if(resenaGuardada){
          this.calificacion=resenaGuardada.calificacion;
          this.comentario=resenaGuardada.comentario;
        }
        this.cargarResenasComunidad(id);
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
  cargarResenasComunidad(id: string): void {
    this.resenasComunidad = [];
    this.promedioComunidad = 0;
    this.cargandoResenasComunidad = true;
    this.mensajeErrorResenasComunidad = '';
    this.resenasComunidadService.obtenerResenas().subscribe({
      next: (resenas) => {
        this.resenasComunidad = resenas.filter(
          resena => resena.idLibro === id
        );
        this.calcularPromedioComunidad();
        this.cargandoResenasComunidad = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar reseñas de la comunidad:', error);
        this.resenasComunidad = [];
        this.promedioComunidad = 0;
        this.mensajeErrorResenasComunidad =
          'No se pudieron cargar las reseñas de la comunidad.';
        this.cargandoResenasComunidad = false;
        this.cdr.detectChanges();
      }
    });
  }
  calcularPromedioComunidad():void{
    if(this.resenasComunidad.length===0){
      this.promedioComunidad=0;
      return;
    }
    const sumaCalificaciones = this.resenasComunidad.reduce(
      (total,resena)=> total+resena.calificacion,0
    );
    this.promedioComunidad= sumaCalificaciones/this.resenasComunidad.length;
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
  alternarFavorito(): void {
    if (!this.idLibro) {
      return;
    }
    const libroGuardado = this.bibliotecaService.obtenerLibro(this.idLibro);
    if (!libroGuardado) {
      this.mensajeFavorito = 'Primero guardá el libro en Mi Biblioteca.';
      return;
    }
    const resultado = this.bibliotecaService.alternarFavorito(this.idLibro);
    if (!resultado) {
      this.mensajeFavorito = 'Ya seleccionaste 4 libros favoritos.';
      return;
    }
    this.esFavorito = !this.esFavorito;
    this.mensajeFavorito = this.esFavorito
      ? '¡Libro agregado a tus favoritos!'
      : 'Libro eliminado de tus favoritos.';
    this.cdr.detectChanges();
  }
  guardarResena(): void{
    if(!this.libro||!this.idLibro){
      return;
    }
    if(this.calificacion<1||this.calificacion>5){
      this.mensajeResena='Seleccioná una Calificacion de 1 a 5 estrellas.';
      return;
    }
    if(!this.comentario.trim()){
      this.mensajeResena='Escribí una reseña antes de guardar.';
      return;
    }
    this.resenasService.guardarResena({
      idLibro:this.idLibro,
      tituloLibro:this.libro.title,
      calificacion:this.calificacion,
      comentario:this.comentario.trim()
    });
    this.mensajeResena ='¡Reseña guardada correctamente!';
    this.cdr.detectChanges();
  }
}
