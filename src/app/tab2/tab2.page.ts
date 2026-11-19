import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {  IonHeader,  IonToolbar,IonTitle,  IonContent,  IonSegment,  IonSegmentButton,  IonLabel,  IonGrid,  IonRow,  IonCol,IonCard,IonCardContent,IonImg,IonSelect,IonSelectOption,IonButton,IonIcon,AlertController} from '@ionic/angular';
import { Router } from '@angular/router';
import {BibliotecaService,LibroGuardado,CategoriaLectura} from '../services/biblioteca.service';
import { addIcons } from 'ionicons';
import { trashOutline, libraryOutline } from 'ionicons/icons';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonImg,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    NgFor,
    NgIf
  ]
})
export class Tab2Page {
  categoriaSeleccionada: CategoriaLectura = 'quiero-leer';
  librosGuardados: LibroGuardado[] = [];
  constructor(
    private bibliotecaService: BibliotecaService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ trashOutline, libraryOutline });
  }
  ionViewWillEnter(): void {
    this.cargarLibros();
  }
  cargarLibros(): void {
    this.librosGuardados = this.bibliotecaService.obtenerLibros();
  }
  cambiarCategoriaSeleccionada(event: CustomEvent): void {
    const categoria = event.detail.value as CategoriaLectura;
    if (categoria) {
      this.categoriaSeleccionada = categoria;
    }
  }
  obtenerLibrosPorCategoria(): LibroGuardado[] {
    return this.librosGuardados.filter(
      libro => libro.categoria === this.categoriaSeleccionada
    );
  }
  contarLibrosPorCategoria(): number {
    return this.obtenerLibrosPorCategoria().length;
  }
  verDetalle(libro: LibroGuardado): void {
    this.router.navigate(['/libro', libro.id]);
  }
  cambiarCategoria(libro: LibroGuardado, event: CustomEvent): void {
    const nuevaCategoria = event.detail.value as CategoriaLectura;

    if (!nuevaCategoria || nuevaCategoria === libro.categoria) {
      return;
    }
    this.bibliotecaService.guardarLibro({
      ...libro,
      categoria: nuevaCategoria
    });
    this.cargarLibros();
  }
  async eliminarLibro(libro: LibroGuardado): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar libro',
      message: `¿Querés eliminar "${libro.titulo}" de tu biblioteca?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.bibliotecaService.eliminarLibro(libro.id);
            this.cargarLibros();
          }
        }
      ]
    });
    await alerta.present();
  }
}
