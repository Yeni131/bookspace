import { Component,ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonHeader,IonToolbar,IonTitle,IonContent,IonIcon,IonButton,IonInput,IonTextarea} from '@ionic/angular';
import { BibliotecaService,LibroGuardado } from '../services/biblioteca.service';
import { ResenasService,Resena } from '../services/resenas.service';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader,IonToolbar,IonTitle,IonContent,IonIcon,NgIf,NgFor,IonButton,IonInput,IonTextarea,FormsModule],
})
export class Tab3Page {
  nombreUsuario = 'Lector BookSpace';
  biografia = 'Mi espacio de lectura';
  nombreTemporal = '';
  biografiaTemporal = '';
  editandoPerfil = false;
  totalGuardados = 0;
  totalLeyendo = 0;
  totalLeidos = 0;
  misResenas:Resena[]=[];
  librosFavoritos: LibroGuardado[] = [];
  constructor(private bibliotecaService: BibliotecaService,private resenasService: ResenasService,private changeDetectorRef: ChangeDetectorRef) {
    addIcons({ personCircleOutline });
  }
  ionViewWillEnter(): void{
    this.cargarEstadisticas();
    this.cargarResenas();
    this.cargarFavoritos();
    this.cargarPerfil();
  }
  cargarEstadisticas(): void{
    this.totalGuardados = this.bibliotecaService.obtenerLibros().length;
    this.totalLeyendo = this.bibliotecaService.obtenerPorCategoria('leyendo').length;
    this.totalLeidos = this.bibliotecaService.obtenerPorCategoria('leidos').length;
    this.changeDetectorRef.detectChanges();
  }
  cargarResenas(): void{
    this.misResenas=this.resenasService.obtenerResenas();
    this.changeDetectorRef.detectChanges();
  }
  cargarFavoritos(): void {
    this.librosFavoritos = this.bibliotecaService.obtenerFavoritos();
    this.changeDetectorRef.detectChanges();
  }
  cargarPerfil(): void {
    const perfilGuardado = localStorage.getItem('bookspace_perfil');
    if (perfilGuardado) {
      try {
        const perfil = JSON.parse(perfilGuardado);
        this.nombreUsuario = perfil.nombre || 'Lector BookSpace';
        this.biografia = perfil.biografia || '';
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    }
  }
  editarPerfil(): void {
    this.nombreTemporal = this.nombreUsuario;
    this.biografiaTemporal = this.biografia;
    this.editandoPerfil = true;
  }
  guardarPerfil(): void {
    const nombre = this.nombreTemporal.trim();

    if (!nombre) {
      return;
    }
    this.nombreUsuario = nombre;
    this.biografia = this.biografiaTemporal.trim();
    localStorage.setItem('bookspace_perfil', JSON.stringify({
      nombre: this.nombreUsuario,
      biografia: this.biografia
    }));
    this.editandoPerfil = false;
  }
  cancelarEdicion(): void {
    this.editandoPerfil = false;
  }
}