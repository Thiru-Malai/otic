import { Component, Input } from '@angular/core';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { AUDIO } from 'src/app/modals/audio';
import { AudioControlService } from 'src/app/modules/audio-control.service';

declare let window: any;
@Component({
  selector: 'app-audio-card',
  templateUrl: './audio-card.component.html',
  styleUrls: ['./audio-card.component.scss'],
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

  async controlAudio1(){
    let audioFile: any;
    if(!this.playing){

      const fileStat: any = await Filesystem.stat({
        path: this.audio.id,
        directory: FilesystemDirectory.External
      }).catch((err) => console.log(err))

      if(!fileStat){
        audioFile = await Filesystem.writeFile({
          path: this.audio.id,
          data: `data:${this.audio?.id}/mpeg;base64,` + this.audio?.audio,
          directory: FilesystemDirectory.External
        }).catch((err) => console.log(err))
      }
      if(audioFile){
        this.audioPlayer = new Audio(window.Ionic.WebView.convertFileSrc(audioFile.uri));
        await this.audioPlayer.play();
        this.playing = true;
      }
    }
    else{
      this.audioPlayer?.pause();
      this.playing = false;
    }
  }
}
