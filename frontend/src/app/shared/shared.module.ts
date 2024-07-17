import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioCardComponent } from './audio-card/audio-card.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AudioCardComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [AudioCardComponent],
})
export class SharedModule {}
