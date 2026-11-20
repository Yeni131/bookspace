import { Component,ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {IonHeader,IonToolbar,IonTitle,IonContent,IonIcon} from '@ionic/angular';
import { BibliotecaService } from '../services/biblioteca.service';
import { ResenasService,Resena } from '../services/resenas.service';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader,IonToolbar,IonTitle,IonContent,IonIcon,NgIf,NgFor],
})
export class Tab3Page {
  totalGuardados = 0;
  totalLeyendo = 0;
  totalLeidos = 0;
  misResenas:Resena[]=[];
  constructor(private bibliotecaService: BibliotecaService,private resenasService: ResenasService,private changeDetectorRef: ChangeDetectorRef) {
    addIcons({ personCircleOutline });
  }
  ionViewWillEnter(): void{
    this.cargarEstadisticas();
    this.cargarResenas();
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
}
