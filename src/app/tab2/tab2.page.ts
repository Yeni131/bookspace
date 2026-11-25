import { Component,ChangeDetectorRef} from '@angular/core';
import { IonProgressBar } from '@ionic/angular';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonHeader,  IonToolbar,IonTitle,  IonContent,  IonSegment,  IonSegmentButton,  IonLabel,  IonGrid,  IonRow,  IonCol,IonCard,IonCardContent,IonImg,IonSelect,IonSelectOption,IonButton,IonIcon,AlertController} from '@ionic/angular';
import { Router } from '@angular/router';
import {BibliotecaService,LibroGuardado,CategoriaLectura} from '../services/biblioteca.service';
import { addIcons } from 'ionicons';
import { trashOutline, libraryOutline } from 'ionicons/icons';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader,IonToolbar,IonTitle,IonContent,IonSegment,IonSegmentButton,IonLabel,IonGrid,IonRow,IonCol,IonCard,IonCardContent,IonImg,IonSelect,IonSelectOption,IonButton,IonIcon,NgFor,NgIf,IonProgressBar,FormsModule]})
export class Tab2Page {
  categoriaSeleccionada: CategoriaLectura = 'quiero-leer';
  librosGuardados: LibroGuardado[] = [];
  ordenSeleccionado:string ='recientes';
  metaLectura: number =12;
  constructor(
    private bibliotecaService: BibliotecaService,
    private router: Router,
    private alertController: AlertController,
    private cdr:ChangeDetectorRef
  ) {
    addIcons({ trashOutline, libraryOutline });
  }
  ionViewWillEnter(): void {
    this.cargarLibros();
    this.cargarMetaLectura();
  }
  cargarLibros(): void {
    this.librosGuardados = this.bibliotecaService.obtenerLibros();
  }
  cargarMetaLectura(): void{
    const metaGuardada = localStorage.getItem('bookspace_meta_lectura');
    if(metaGuardada!== null){
      const meta= Number(metaGuardada);
      if(Number.isInteger(meta)&& meta>0){
        this.metaLectura=meta;
      }
    }
  }
  guardarMetaLectura(nuevaMeta:number):void{
    if(!Number.isInteger(nuevaMeta)|| nuevaMeta<=0){
      return;
    }
    this.metaLectura=nuevaMeta;
    localStorage.setItem(
      'bookspace_meta_lectura',
      String(this.metaLectura)
    );
  }
  async cambiarMetaLectura(): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Cambiar meta de lectura',
      message: '¿Cuántos libros querés leer?',
      inputs: [
        {
          name: 'meta',
          type: 'number',
          value: this.metaLectura,
          min: 1,
          placeholder: 'Ejemplo: 12'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (datos) => {
            const nuevaMeta = Number(datos.meta);
            if (!Number.isInteger(nuevaMeta) || nuevaMeta <= 0) {
              return false;
            }
            this.guardarMetaLectura(nuevaMeta);
            return true;
          }
        }
      ]
    });
    await alerta.present();
  }
  cambiarCategoriaSeleccionada(event: CustomEvent): void {
    const categoria = event.detail.value as CategoriaLectura;
    if (categoria) {
      this.categoriaSeleccionada = categoria;
    }
  }
  cambiarOrden(event:CustomEvent):void{
    const nuevoOrden = event.detail.value;
    if(nuevoOrden){
      this.ordenSeleccionado=nuevoOrden;
      this.cdr.detectChanges();
    }
  }
  obtenerLibrosPorCategoria(): LibroGuardado[] {
    const libros = this.librosGuardados.filter(
      libro => libro.categoria === this.categoriaSeleccionada
    );
    if (this.ordenSeleccionado === 'titulo-asc') {
      return libros.sort((a, b) =>
        a.titulo.localeCompare(b.titulo, 'es')
      );
    }
    if (this.ordenSeleccionado === 'titulo-desc') {
      return libros.sort((a, b) =>
        b.titulo.localeCompare(a.titulo, 'es')
      );
    }
    return libros.reverse();
  }
  contarLibrosPorCategoria(): number {
    return this.obtenerLibrosPorCategoria().length;
  }
  obtenerLibrosLeidos(): number{
    return this.librosGuardados.filter(
      libro=> libro.categoria==='leidos'
    ).length;
  }
  obtenerPorcentajeReto():number{
    if(this.metaLectura<=0){
      return 0;
    }
    return Math.min(100,Math.round((this.obtenerLibrosLeidos()/this.metaLectura)*100));
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
