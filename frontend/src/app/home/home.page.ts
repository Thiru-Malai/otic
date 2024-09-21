import { Component, effect } from '@angular/core';
import { DownloadAudioService } from '../modules/download-audio.service';
import { LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { AUDIO } from '../modals/audio';
import { DatabaseService } from '../modules/database.service';
import { AudioCardComponent } from '../shared/audio-card/audio-card.component';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, NgIf, NgFor, AudioCardComponent]
})
export class HomePage {
  url: string = 'https://youtu.be/FAyKDaXEAgc?si=GhSsrTPzyJlr58Az';
  audios = this.dbService.getAudios();
  loading: any;

  constructor(
    private audioService: DownloadAudioService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private dbService: DatabaseService
  ) {
    effect(() => {
      console.log('AUDIO ADDED', this.audios())
    })
    console.log(this.audios)
  }

  async saveAudioToDB() {
    this.loading = await this.loadingCtrl.create({
      message: 'Downloading audio....',
    });
    this.loading.present();
    const message = await this.audioService.saveAudioToDB(this.url);
    if(typeof message === 'string'){
      this.loading.dismiss();
      this.toastCtrl.create({
        message: message,
        duration: 2000,
      }).then(toast => toast.present())
      return;
    }
    console.log(message)
    const id: any = JSON.parse(JSON.stringify(message));
    this.getAudioFromDB(id['message'])
  }

  async getAudioFromDB(id: string) {
    const audio = await this.audioService.getAudioFromDB(id)
    console.log(audio);
    // this.audios.push(audio);
    this.dbService.addAudio(audio);
    this.loading.dismiss();
  }
}
