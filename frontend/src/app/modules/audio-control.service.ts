import { Injectable } from '@angular/core';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { AUDIO } from '../modals/audio';
import { Subject } from 'rxjs';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class AudioControlService {
  audioPlayer?: HTMLAudioElement;
  audioFile: any;
  _isPlaying: Subject<any> = new Subject<any>();
  constructor() { }

  private async audioExistsInLocal(audio: AUDIO): Promise<Boolean>{
    const fileStat: any = await Filesystem.stat({
      path: audio.id,
      directory: FilesystemDirectory.External
    }).catch((err) => {
      console.log(err)
      return Promise.resolve(false);
    })
    if(fileStat){
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  private async createAudioInLocal(audio: AUDIO): Promise<Boolean>{
    this.audioFile = await Filesystem.writeFile({
      path: audio.id,
      data: `data:${audio.id}/mpeg;base64,` + audio.audio,
      directory: FilesystemDirectory.External
    }).catch((err) => {
      console.log(err)
      throw new err;
    })
    return Promise.resolve(true);
  }

  async playAudio(audio: AUDIO){
    this.audioExistsInLocal(audio)
    .then((audioExists) => {
      console.log(audioExists)
      return Promise.resolve(audioExists);
    })
    .then((audioExists) => {
      if(!audioExists){
        console.log(audioExists)
        return this.createAudioInLocal(audio)
      }
      return Promise.resolve(true);
    })
    .then(async (result) => {
      if(result){
        console.log(result)
        this.audioPlayer = new Audio(window.Ionic.WebView.convertFileSrc(this.audioFile.uri));
        await this.audioPlayer.play();
        this._isPlaying.next({id: audio.id, state: 'play'})
      }
    })
    .catch((err) => {
      console.log(err)
    })
    // const audioExists = await this.audioExistsInLocal(audio);
    // if(!audioExists){
    //   this.createAudioInLocal(audio).then(async (result)=>{
    //       this.audioPlayer = new Audio(window.Ionic.WebView.convertFileSrc(this.audioFile.uri));
    //       await this.audioPlayer.play();
    //   })
    // }
  }

  pauseAudio(audio: AUDIO){
    this.audioPlayer?.pause();
    this._isPlaying.next({id: audio.id, state: 'pause'})
  }
}
