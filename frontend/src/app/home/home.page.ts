import { Component } from '@angular/core';
import { DownloadAudioService } from '../modules/download-audio.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AUDIO } from '../modals/audio';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  url: string = 'https://youtu.be/2wTy_O0Kpl4?si=1gc0K_VXImAOV4xS';
  audios: AUDIO[] = [];
  loading: any;

  constructor(
    private audioService: DownloadAudioService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

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
    this.audios.push(audio);
    this.loading.dismiss();
  }
}
