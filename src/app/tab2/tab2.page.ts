import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonSegment,IonSegmentButton,IonLabel } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,IonLabel, FormsModule],
})
export class Tab2Page {
  categoriaSeleccionada = 'quiero-leer';
  constructor() {}
}
