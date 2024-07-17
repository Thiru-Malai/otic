import { Component } from '@angular/core';
import { DownloadAudioService } from '../services/download-audio.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  url: string = '';
  audios: any[] = [
    {
      title: 'Immortals',
      author: 'Imagine Dragons',
    },
  ];

  constructor(private audioService: DownloadAudioService) {}

  downloadAudio() {
   this.audioService.downloadAudio(this.url);
  }
}
