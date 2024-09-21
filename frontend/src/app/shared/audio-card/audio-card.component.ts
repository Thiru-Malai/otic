import { Component, Input } from '@angular/core';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { AUDIO } from 'src/app/modals/audio';
import { AudioControlService } from 'src/app/modules/audio-control.service';
import { NgIf, SlicePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';

declare let window: any;
@Component({
    selector: 'app-audio-card',
    templateUrl: './audio-card.component.html',
    styleUrls: ['./audio-card.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        SlicePipe,
    ],
})

export class AudioCardComponent {
  @Input() audio!: AUDIO;
  playing: boolean = false;
  audioPlayer?: HTMLAudioElement;
  
  constructor(private audioControlService: AudioControlService) {
    audioControlService._isPlaying.subscribe((result) => {
      if(this.audio.id == result.id && result.state == 'play'){
        this.playing = true;
      }
      else if(this.audio.id == result.id && result.state == 'pause'){
        this.playing = false;
      }
      else{
        this.playing = false;
      }
    })
  }

  playAudio(){
    this.audioControlService.playAudio(this.audio);
  }

  pauseAudio(){
    this.audioControlService.pauseAudio(this.audio.id);
  }
}
