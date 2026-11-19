import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonSegment,IonSegmentButton,IonLabel,IonGrid,IonRow,IonCol,IonCard,IonCardContent,IonImg} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BibliotecaService, LibroGuardado, CategoriaLectura } from '../services/biblioteca.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,IonLabel,IonGrid,IonRow,IonCol,IonCard,IonCardContent,IonImg, FormsModule,NgFor,NgIf],
})
export class Tab2Page {
  categoriaSeleccionada = 'quiero-leer';
  librosGuardados: LibroGuardado[] = [];
  constructor(private bibliotecaService: BibliotecaService, private router: Router) {}
  ionViewWillEnter(): void{
    this.cargarLibros();
  }
  cargarLibros(): void{
    this.librosGuardados = this.bibliotecaService.obtenerLibros();
  }
  obtenerLibrosPorCategoria(): LibroGuardado[]{
    return this.librosGuardados.filter(
      libro => libro.categoria === this.categoriaSeleccionada
    );
  }
  verDetalle( libro: LibroGuardado): void{
    this.router.navigate(['/libro', libro.id])
  }
}
